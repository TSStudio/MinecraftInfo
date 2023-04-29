<template id="serverStatus">
    <el-row>
        <el-col :sm="12" :lg="6">
            <el-result
                :icon="s1_status"
                title="TSS 主服务器"
                :sub-title="s1_subtitle"
            >
            </el-result>
        </el-col>
        <el-col :sm="12" :lg="6">
            <el-result
                :icon="s2_status"
                title="TSS 协处理服务器"
                :sub-title="s2_subtitle"
            >
            </el-result>
        </el-col>
        <el-col :sm="12" :lg="6">
            <el-result
                :icon="s3_status"
                title="TSS 资源服务器"
                :sub-title="s3_subtitle"
            >
            </el-result>
        </el-col>
        <el-col :sm="12" :lg="6">
            <el-result
                icon="info"
                title="阿里云服务"
                sub-title="请查看status.aliyun.com 深圳"
            >
            </el-result>
        </el-col>
    </el-row>
</template>

<script>
const username = "tmy_Sam";
export default {
    data() {
        return {
            s1_status: "info",
            s2_status: "info",
            s3_status: "info",
            s1_subtitle: "正在获取服务器状态",
            s2_subtitle: "正在获取服务器状态",
            s3_subtitle: "正在获取服务器状态",

            username: username,
        };
    },
    methods: {
        fetch1() {
            fetch(
                "https://account.tmysam.top/apps/minecraftInfo/api/server_status.php?" +
                    process.env.API_ARG
            )
                .then((response) => {
                    if (response.status == 200) {
                        response.json().then((jdata) => {
                            if (jdata.server_main_status == 0) {
                                this.s1_status = "error";
                                this.s1_subtitle = "状态异常";
                            } else if (jdata.server_main_status == 2) {
                                this.s1_status = "warning";
                                this.s1_subtitle = "负载过高";
                            } else {
                                this.s1_status = "success";
                                this.s1_subtitle = "正常";
                            }
                            if (jdata.server_assist_status == 0) {
                                this.s2_status = "error";
                                this.s2_subtitle = "状态异常";
                            } else if (jdata.server_assist_status == 2) {
                                this.s2_status = "warning";
                                this.s2_subtitle = "负载过高";
                            } else {
                                this.s2_status = "success";
                                this.s2_subtitle = "正常";
                            }
                        });
                    } else {
                        this.s1_status = "error";
                        this.s1_subtitle = "状态获取失败";
                        this.s2_status = "error";
                        this.s2_subtitle = "状态获取失败";
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        fetch2() {
            fetch("https://resource.tmysam.top/ping")
                .then((response) => {
                    if (response.status == 200) {
                        this.s3_status = "success";
                        this.s3_subtitle = "正常";
                    } else {
                        this.s3_status = "error";
                        this.s3_subtitle = "状态异常";
                    }
                })

                .catch((error) => {
                    this.s3_status = "error";
                    this.s3_subtitle = "状态获取失败";
                });
        },
    },
    name: "serverStatus",
    beforeMount() {
        this.fetch1();
        this.fetch2();
    },
};
// fetch 1: https://account.tmysam.top/apps/minecraftInfo/api/server_status.php
// returns: {"server_main_status":1,"server_assist_status":1} // 0 down 1 ok 2 high load
// fetch 2: https://resource.tmysam.top/ping
// returns: pong

// run onload
</script>
<style></style>
