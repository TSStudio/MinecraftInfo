<template id="bindManage">
    <el-steps v-bind:active="step" finish-status="success" align-center>
        <el-step title="步骤 1" description="输入你的 Minecraft 用户名" />
        <el-step title="步骤 2" description="获取并发送你的 Unique Code" />
        <el-step title="步骤 3" description="验证你的 Unique Code" />
    </el-steps>
    <step1
        v-if="step == 0"
        :ucode="ucode"
        @setusername="setusername"
        @setucode="setucode"
        @next="next"
    />
    <step2
        v-if="step == 1"
        :ucode="ucode"
        :username="username"
        @next="next"
        @getMainPageBindStatus="getMainPageBindStatus"
    />
    <step3
        v-if="step == 2"
        :username="username"
        @next="next"
        @rebind="rebind"
        @getMainPageBindStatus="getMainPageBindStatus"
    />
</template>

<script>
import step1 from "./bindSteps/step1.vue";
import step2 from "./bindSteps/step2.vue";
import step3 from "./bindSteps/step3.vue";

export default {
    data() {
        return {
            username: "",
            ucode: "",
            step: 0,
        };
    },
    components: {
        step1,
        step2,
        step3,
    },
    methods: {
        rebind() {
            this.step = 0;
            //TODO: call the API to rebind the account
        },
        prev() {
            this.step--;
        },
        next() {
            this.step++;
        },
        setusername(username) {
            this.username = username;
        },
        setucode(ucode) {
            this.ucode = ucode;
        },
        getMainPageBindStatus() {
            this.$emit("getBindStatus");
        },
        getBindStatus() {
            const loadingInstance = ElLoading.service({
                fullscreen: true,
            });
            //https://account.tmysam.top/apps/minecraftInfo/api/bind_status.php
            // returns JSON {"success":step,"data":{...}}
            // if step = 1 then data = {"mcid":mcid,"ucode":ucode}
            // if step = 2 then data = {"mcid":mcid}
            //send request

            fetch(
                "https://account.tmysam.top/apps/minecraftInfo/api/bind_status.php?" +
                    process.env.API_ARG
            )
                .then((response) => {
                    if (response.status == 200) {
                        response.json().then((jdata) => {
                            if (jdata.success == 1) {
                                this.step = 1;
                                this.username = jdata.data.mcid;
                                this.ucode = jdata.data.ucode;
                            } else if (jdata.success == 2) {
                                this.step = 2;
                                this.username = jdata.data.mcid;
                            } else {
                                this.step = 0;
                            }
                        });
                    } else {
                        this.step = 0;
                    }
                })
                .catch((error) => {
                    this.step = 0;
                })
                .finally(() => {
                    loadingInstance.close();
                });
        },
    },
    beforeMount() {
        this.getBindStatus();
    },
    name: "bindManage",
};
//
</script>
<style></style>
