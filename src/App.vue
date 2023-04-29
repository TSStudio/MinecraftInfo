<template>
    <div id="sidebar">
        <div id="m-title">HoL Panel</div>
        <el-menu
            class="el-menu-vertical-demo"
            v-bind:default-active="compIndex"
            @open="handleOpen"
            @close="handleClose"
            @select="handleSelect"
            ref="menu"
        >
            <el-sub-menu index="1">
                <template #title>
                    <span>我的信息</span>
                </template>
                <el-menu-item-group title="经济">
                    <el-menu-item index="1-1" ref="I1-1" :disabled="d1"
                        >账户</el-menu-item
                    >
                    <el-menu-item index="1-2" ref="I1-2" :disabled="d1"
                        >明细</el-menu-item
                    >
                    <el-menu-item index="1-3" ref="I1-3" :disabled="d1"
                        >我的商店</el-menu-item
                    >
                    <el-menu-item index="1-5" ref="I1-5" :disabled="d1"
                        >转账</el-menu-item
                    >
                </el-menu-item-group>
                <el-menu-item-group title="绑定服务器账户">
                    <el-menu-item index="1-4" ref="I1-4">绑定管理</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group title="设置">
                    <el-menu-item index="1-6" ref="I1-6">通知设置</el-menu-item>
                </el-menu-item-group>
            </el-sub-menu>
            <el-menu-item index="2" ref="I2">
                <span>服务器状态</span>
            </el-menu-item>
        </el-menu>
    </div>
    <div id="main">
        <myAccount
            v-if="comp == 'myAccount'"
            @setmyShopList="setComp('myShopList')"
            @setCompmyAccountDetails="setComp('myAccountDetails')"
            :username="username"
        ></myAccount>
        <myAccountDetails v-if="comp == 'myAccountDetails'"></myAccountDetails>
        <myShopList v-if="comp == 'myShopList'"></myShopList>
        <bindManage
            v-if="comp == 'bindManage'"
            @getBindStatus="getBindStatus"
        ></bindManage>
        <serverStatus v-if="comp == 'serverStatus'"></serverStatus>
        <settings v-if="comp == 'settings'"></settings>
        <pay v-if="comp == 'pay'"></pay>
    </div>
</template>

<script>
import myAccount from "./components/myAccount.vue";
import myAccountDetails from "./components/myAccountDetails.vue";
import myShopList from "./components/myShopList.vue";
import bindManage from "./components/bindManage.vue";
import serverStatus from "./components/serverStatus.vue";
import pay from "./components/pay.vue";
import settings from "./components/settings.vue";

const mappings = {
    "1-1": "myAccount",
    "1-2": "myAccountDetails",
    "1-3": "myShopList",
    "1-4": "bindManage",
    "1-5": "pay",
    "1-6": "settings",
    2: "serverStatus",
};
const reverse_mappings = {
    myAccount: "1-1",
    myAccountDetails: "1-2",
    myShopList: "1-3",
    bindManage: "1-4",
    pay: "1-5",
    settings: "1-6",
    serverStatus: 2,
};
export default {
    data() {
        return {
            username: "",
            comp: "serverStatus",
            compIndex: "2",
            d1: true,
        };
    },
    components: {
        myAccount,
        myAccountDetails,
        myShopList,
        bindManage,
        serverStatus,
        settings,
        pay,
    },
    methods: {
        setComp(c) {
            this.comp = c;
            this.compIndex = reverse_mappings[c];
        },
        handleSelect(key) {
            let comps = mappings[key];
            if (comps) {
                this.comp = comps;
                this.compIndex = key;
            }
        },
        handleMinimizedMode() {
            this.d1 = true;
            this.handleSelect("1-4");
        },
        handleUnlimitedMode() {
            this.d1 = false;
            this.handleSelect("1-1");
        },
        getBindStatus() {
            fetch(
                "https://account.tmysam.top/apps/minecraftInfo/api/bind_status.php?" +
                    process.env.API_ARG
            )
                .then((response) => {
                    if (response.status == 200) {
                        response.json().then((jdata) => {
                            if (jdata.iserror) {
                                ElMessage.error(jdata.msg);
                                if (jdata.error == "Login-status error: 1") {
                                    window.location.href =
                                        "https://account.tmysam.top/login.html";
                                }
                                return;
                            }
                            if (jdata.success != 2) {
                                this.handleMinimizedMode();
                            } else {
                                this.handleUnlimitedMode();
                                this.username = jdata.data.mcid;
                            }
                        });
                    } else {
                        ElMessage.error("服务器错误");
                    }
                })
                .catch((error) => {
                    ElMessage.error("网络错误:" + error);
                });
        },
        getusername() {
            return this.username;
        },
    },

    beforeMount() {
        this.getBindStatus();
    },
};
</script>
<script setup></script>
