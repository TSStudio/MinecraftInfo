<template id="settings">
    <el-form :model="form" label-width="360px">
        <el-form-item label="接受转账时发送电子邮件通知（仅网页）">
            <el-switch
                v-model="form.enableEmailWhenPaid"
                @change="updatedata"
                :loading="loading"
            />
        </el-form-item>
        <el-form-item label="转账时发送电子邮件通知（仅网页）">
            <el-switch
                v-model="form.enableEmailWhenPaying"
                @change="updatedata"
                :loading="loading"
            />
        </el-form-item>
    </el-form>
</template>

<script>
export default {
    data() {
        return {
            loading: false,
            form: {},
        };
    },
    methods: {
        error(errorMsg) {
            ElMessage.error(errorMsg);
        },
        constructSettingValue() {
            const settings = ["enableEmailWhenPaid", "enableEmailWhenPaying"];
            let settingValue = 0;
            for (let i = 0; i < settings.length; i++) {
                const setting = settings[i];
                if (this.form[setting]) {
                    settingValue += 1 << i;
                }
            }
            return settingValue;
        },
        fetchdata() {
            this.loading = true;
            fetch(
                "https://account.tmysam.top/apps/minecraftInfo/api/get_settings.php?" +
                    process.env.API_ARG
            )
                .then((response) => {
                    if (response.status == 200) {
                        response.json().then((jdata) => {
                            if (jdata.iserror) {
                                ElMessage.error(jdata.msg);
                                return;
                            }
                            const settings = [
                                "enableEmailWhenPaid",
                                "enableEmailWhenPaying",
                            ];
                            for (let i = 0; i < settings.length; i++) {
                                const setting = settings[i];
                                this.form[setting] =
                                    jdata.success[setting] == 1 ? true : false;
                            }
                        });
                    } else {
                        ElMessage.error("服务器错误");
                    }
                })
                .catch((error) => {
                    ElMessage.error("网络错误:" + error);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        updatedata() {
            this.loading = true;
            fetch(
                "https://account.tmysam.top/apps/minecraftInfo/api/set_settings.php?" +
                    process.env.API_ARG +
                    "&settingValue=" +
                    this.constructSettingValue()
            )
                .then((response) => {
                    if (response.status == 200) {
                        response.json().then((jdata) => {
                            if (jdata.iserror) {
                                ElMessage.error(jdata.msg);
                                return;
                            }
                        });
                    } else {
                        ElMessage.error("服务器错误");
                    }
                })
                .catch((error) => {
                    ElMessage.error("网络错误:" + error);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
    },
    mounted() {
        this.fetchdata();
    },
    name: "settings",
};
</script>
<style></style>
