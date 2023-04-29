<template id="step1">
    <div class="step-main-container">
        <el-autocomplete
            v-model="input"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入 Minecraft 用户名"
            class="username-input"
        />
    </div>
    <div class="step-main-container">
        <el-button type="primary" @click="next">下一步</el-button>
    </div>
</template>
<script>
export default {
    data() {
        return {
            input: "",
        };
    },
    methods: {
        error(errorMsg) {
            ElMessage.error(errorMsg);
        },
        next() {
            if (this.input == "") {
                this.error("请输入 Minecraft 用户名");
                return;
            }
            if (this.input.length > 32) {
                this.error("用户名过长");
                return;
            }
            //send input as mcid to https://account.tmysam.top/apps/minecraftInfo/api/step1.php
            //returns JSON {"iserror":false,"success":ucode} or {"iserror":true,"error":error}
            //url encode the mcid
            let mcid = encodeURIComponent(this.input);
            fetch(
                "https://account.tmysam.top/apps/minecraftInfo/api/step1.php?mcid=" +
                    mcid +
                    "&" +
                    process.env.API_ARG
            )
                .then((response) => {
                    if (response.status == 200) {
                        response.json().then((jdata) => {
                            if (jdata.iserror) {
                                this.error(jdata.error);
                            } else {
                                this.$emit("setusername", this.input);
                                this.$emit("setucode", jdata.success);
                                this.$emit("next");
                            }
                        });
                    } else {
                        this.error("服务器错误");
                    }
                })
                .catch((error) => {
                    this.error("网络错误");
                });
        },
    },
};
</script>
<script setup>
var cache = {};
const querySearchAsync = (queryString, callback) => {
    console.log(queryString);
    if (queryString == "") {
        callback([]);
        return;
    }
    //check cache
    if (cache[queryString]) {
        callback(cache[queryString]);
        return;
    }
    fetch(
        "https://account.tmysam.top/apps/minecraftInfo/api/playername_suggestion.php?start_with=" +
            queryString +
            "&username=Steve"
    )
        .then((response) => {
            if (response.status == 200) {
                response.json().then((jdata) => {
                    let list = [];
                    for (let i of jdata) {
                        list.push({ value: i });
                    }
                    //add to cache
                    cache[queryString] = list;
                    // response json is :[] => array
                    callback(list);
                });
            } else {
                callback([]);
            }
        })
        .catch((error) => {
            console.log(error);
            callback([]);
        });
};
</script>
