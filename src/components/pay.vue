<template id="pay">
    <div ref="boxRef">
        <el-form
            ref="FormRef"
            :model="form"
            label-width="240px"
            :rules="rulesX"
        >
            <el-form-item label="对方 Minecraft 用户名" prop="username">
                <el-autocomplete
                    v-model="form.username"
                    :fetch-suggestions="querySearchAsync"
                    placeholder="Username"
                />
            </el-form-item>

            <el-form-item label="金额" prop="money">
                <el-col :span="8">
                    <el-input v-model="form.money" />（余额：{{ balance }}，剩
                    {{ Afterbalance }} ）
                </el-col>
            </el-form-item>
            <el-form-item>
                <el-popconfirm
                    title="确定转账吗？操作不可撤销。"
                    width="300px"
                    confirm-button-text="确定"
                    cancel-button-text="取消"
                    confirm-button-type="danger"
                    cancel-button-type="success"
                    @confirm="submit"
                >
                    <template #reference>
                        <el-button type="primary">转账</el-button></template
                    >
                </el-popconfirm>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    data() {
        return {};
    },
    methods: {},
    name: "pay",
};
//
</script>
<script setup>
import { getCurrentInstance, ref, onMounted } from "vue";
const form = ref({
    money: 0.0,
});
const balance = ref(0);
const Afterbalance = ref(0);
const boxRef = ref(null);
const error = (errorMsg) => {
    ElMessage.error(errorMsg);
};
const cache = ref({});
const username = ref("Steve");
const querySearchAsync = (queryString, callback) => {
    if (queryString == "") {
        callback([]);
        return;
    }
    if (cache.value[queryString]) {
        callback(cache.value[queryString]);
        return;
    }
    fetch(
        "https://account.tmysam.top/apps/minecraftInfo/api/playername_suggestion.php?start_with=" +
            queryString +
            "&username=" +
            username.value
    )
        .then((response) => {
            if (response.status == 200) {
                response.json().then((jdata) => {
                    let list = [];
                    for (let i of jdata) {
                        list.push({ value: i });
                    }
                    cache.value[queryString] = list;
                    callback(list);
                });
            } else {
                callback([]);
            }
        })
        .catch((error) => {
            callback([]);
        });
};
const fetchdata = () => {
    const loadingInstance = ElLoading.service({
        fullscreen: false,
        target: boxRef.value,
    });
    fetch(
        "https://account.tmysam.top/apps/minecraftInfo/api/get_profile.php?" +
            process.env.API_ARG
    )
        .then((response) => {
            if (response.status == 200) {
                response.json().then((jdata) => {
                    if (jdata.iserror) {
                        error(jdata.error);
                    } else {
                        balance.value = jdata.data.balance;
                        Afterbalance.value = jdata.data.balance;
                        username.value = jdata.data.mcid;
                    }
                });
            } else {
                error("服务器错误");
            }
        })
        .catch((error) => {
            error("网络错误");
        })
        .finally(() => {
            loadingInstance.close();
        });
};
const checkPlayerExist = (usernamex, callback) => {
    fetch(
        "https://account.tmysam.top/apps/minecraftInfo/api/player_exist.php?username=" +
            usernamex
    )
        .then((response) => {
            if (response.status == 200) {
                response.json().then((jdata) => {
                    if (jdata.exist) {
                        callback();
                    } else {
                        callback(new Error("用户名不存在"));
                    }
                });
            } else {
                error("服务器错误");
            }
        })
        .catch((error) => {
            error("网络错误");
        });
};
onMounted(() => {
    fetchdata();
});
const checkMoney = (rule, value, callback) => {
    if (!value) return callback(new Error("金额不能为空"));
    if (isNaN(value)) return callback(new Error("金额必须为数字"));

    value = parseFloat(value);
    Afterbalance.value = parseFloat(balance.value - value).toFixed(2);
    if (value < 0) {
        callback(new Error("金额不能为负数"));
    } else if (value > balance.value) {
        callback(new Error("余额不足"));
    } else {
        callback();
    }
};
const checkName = (rule, value, callback) => {
    if (!value) return callback(new Error("用户名不能为空"));
    if (value.length < 2 || value.length > 32) {
        return callback(new Error("用户名长度错误"));
    }
    if (value == username.value) {
        return callback(new Error("不能给自己转账"));
    }
    checkPlayerExist(value, callback);
};
const rulesX = {
    username: [{ validator: checkName, trigger: "blur", required: true }],
    money: [{ validator: checkMoney, trigger: "blur", required: true }],
};
const FormRef = ref(null);
const submit = () => {
    //check validate
    FormRef.value.validate((valid) => {
        if (valid) {
        } else {
            ElMessage.error("请检查输入");
            return false;
        }
    });
    const loadingInstance = ElLoading.service({
        fullscreen: false,
        target: boxRef.value,
    });
    fetch(
        "https://account.tmysam.top/apps/minecraftInfo/api/pay.php?" +
            process.env.API_ARG +
            "&username=" +
            form.value.username +
            "&money=" +
            form.value.money
    )
        .then((response) => {
            if (response.status == 200) {
                response.json().then((jdata) => {
                    if (jdata.iserror) {
                        error(jdata.error);
                    } else {
                        ElMessage.success("转账成功");
                        fetchdata();
                    }
                });
            } else {
                error("服务器错误");
            }
        })
        .catch((error) => {
            error("网络错误");
        })
        .finally(() => {
            loadingInstance.close();
        });
};
</script>
