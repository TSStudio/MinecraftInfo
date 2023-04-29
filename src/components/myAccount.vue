<template id="myAccount">
    <div class="common-layout">
        <el-container ref="box">
            <el-header style="background-color: #409eff" class="cardHeader">
                {{ username }}</el-header
            >
            <el-container>
                <el-aside width="300px" style="background-color: #c6e2ff"
                    ><iframe
                        id="skinView"
                        :src="`https://www.tmysam.top/skinRender/skin.html?skin=${username}`"
                        frameborder="0"
                    ></iframe
                ></el-aside>
                <el-main style="background-color: #d9ecff" class="cardMain"
                    >账户余额 {{ balance }}
                    <el-button type="primary" @click="openDetails"
                        >查看明细</el-button
                    ><br />
                    商店数量 {{ shopcount }}
                    <el-button type="primary" @click="openShopList"
                        >查看明细</el-button
                    ></el-main
                >
            </el-container>
        </el-container>
    </div>
</template>

<script>
export default {
    data() {
        return {
            balance: "0.00",
            shopcount: 0,
        };
    },
    methods: {
        openShopList() {
            this.$emit("setmyShopList");
        },
        openDetails() {
            this.$emit("setCompmyAccountDetails");
        },
        error(errorMsg) {
            ElMessage.error(errorMsg);
        },
        fetchdata() {
            const loadingInstance = ElLoading.service({
                fullscreen: false,
                target: this.$refs.box.$el,
            });
            fetch(
                "https://account.tmysam.top/apps/minecraftInfo/api/get_profile.php?" +
                    process.env.API_ARG
            )
                .then((response) => {
                    if (response.status == 200) {
                        response.json().then((jdata) => {
                            if (jdata.iserror) {
                                this.error(jdata.error);
                            } else {
                                this.balance = jdata.data.balance;
                                this.shopcount = jdata.data.shopcount;
                            }
                        });
                    } else {
                        this.error("服务器错误");
                    }
                })
                .catch((error) => {
                    this.error("网络错误");
                })
                .finally(() => {
                    loadingInstance.close();
                });
        },
    },
    props: {
        username: {
            type: String,
            default: "",
            required: true,
        },
    },
    mounted() {
        this.fetchdata();
    },
    name: "myAccount",
};
//
</script>
<style></style>
