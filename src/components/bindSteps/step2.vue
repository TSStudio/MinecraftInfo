<template id="step2">
    <div class="step-main-container">你的 Unique Code:</div>
    <div class="step-main-container">
        <div class="codeshow inline-flex">{{ ucode }}</div>
    </div>
    <div class="step-main-container">
        请在 15 分钟内在
        {{ username }}
        发出的聊天中包含这段字符，然后在聊天发出后回到此页面点击下一步。用户名输入错误请
        15 分钟后再进入此页面。
    </div>
    <div class="step-main-container">
        <el-button type="primary" @click="next">下一步</el-button>
    </div>
</template>
<script>
export default {
    methods: {
        error(errorMsg) {
            ElMessage.error(errorMsg);
        },
        next() {
            //send a request to https://account.tmysam.top/apps/minecraftInfo/api/step2.php
            //returns JSON {"iserror":false} or {"iserror":true,"error":error}
            //no payload
            fetch(
                "https://account.tmysam.top/apps/minecraftInfo/api/step2.php?" +
                    process.env.API_ARG
            )
                .then((response) => {
                    if (response.status == 200) {
                        response.json().then((jdata) => {
                            if (jdata.iserror) {
                                this.error(jdata.error);
                            } else {
                                this.$emit("getMainPageBindStatus");
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
    props: {
        username: {
            type: String,
            default: "",
        },
        ucode: {
            type: String,
            default: "",
        },
    },
};
</script>
