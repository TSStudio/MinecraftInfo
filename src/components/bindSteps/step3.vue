<template id="step3">
    <div class="step-main-container">
        <el-result
            icon="success"
            title="绑定完成"
            sub-title="你可以正常使用各种功能"
        ></el-result>
    </div>
    <div class="step-main-container">
        <el-popconfirm
            @confirm="rebind"
            width="220"
            confirm-button-text="确定"
            cancel-button-text="取消"
            :icon="InfoFilled"
            icon-color="#626AEF"
            title="你确定要取消绑定吗？"
            ><template #reference
                ><el-button type="primary">重新绑定</el-button></template
            ></el-popconfirm
        >
    </div>
</template>
<script>
export default {
    methods: {
        rebind() {
            //https://account.tmysam.top/apps/minecraftInfo/api/reset.php

            fetch(
                "https://account.tmysam.top/apps/minecraftInfo/api/reset.php?" +
                    process.env.API_ARG
            )
                .then((response) => {
                    if (response.status == 200) {
                    } else {
                        this.error("服务器错误");
                    }
                })
                .catch((error) => {
                    this.error("网络错误");
                })
                .finally(() => {
                    this.$emit("getMainPageBindStatus");
                    this.$emit("rebind");
                });
        },
    },
};
</script>
