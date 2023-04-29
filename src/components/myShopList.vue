<template id="myShopList">
    <el-table ref="table" :data="tableData" style="width: 100%">
        <el-table-column prop="item" label="物品" width="240" />
        <el-table-column prop="price" label="单价" width="100" />
        <el-table-column prop="pos" label="坐标" width="180" />
        <el-table-column prop="type" label="类别" />
    </el-table>
    <el-pagination
        class="pagination"
        background
        layout="prev, pager, next"
        :page-count="totalPage"
        v-model:current-page="currentPage"
    />
</template>

<script>
import { pageQuery, pageRecord } from "../util/page";
export default {
    data() {
        return {
            tableData: [],
            totalPage: 1,
            currentPage: 1,
            pageQueryer: new pageQuery(
                "https://account.tmysam.top/apps/minecraftInfo/api/get_shops.php",
                process.env.API_ARG
            ),
        };
    },
    methods: {
        error(errorMsg) {
            ElMessage.error(errorMsg);
        },
        getPage(page = 1) {
            const loadingInstance = ElLoading.service({
                fullscreen: false,
                target: this.$refs.table.$el,
            });
            if (this.currentPage != page) {
                page = this.currentPage;
            }
            let url = this.pageQueryer.constructQueryString(page);
            fetch(url)
                .then((response) => {
                    if (response.status == 200) {
                        response.json().then((jdata) => {
                            if (jdata.iserror) {
                                this.error(jdata.error);
                            } else {
                                this.tableData = jdata.data;
                                this.totalPage = jdata.success;
                                this.pageQueryer.push(page, jdata.id);
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
    mounted() {
        this.getPage(1);
    },
    watch: {
        currentPage: function (val) {
            this.getPage(val);
        },
    },
    name: "myShopList",
};
//
</script>
<style></style>
