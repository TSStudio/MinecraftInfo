<template id="myAccountDetails">
    <el-table ref="table" :data="tableData" style="width: 100%">
        <el-table-column prop="datetime" label="日期(UTC+8)" width="240" />
        <el-table-column prop="type" label="类别" width="100" />
        <el-table-column prop="amount" label="金额" width="180" />
        <el-table-column prop="balance" label="操作后余额" width="180" />
        <el-table-column prop="comment" label="标注" />
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
                "https://account.tmysam.top/apps/minecraftInfo/api/get_balance_record.php",
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
    watch: {
        currentPage: function (val) {
            this.getPage(val);
        },
    },
    mounted() {
        this.getPage(1);
    },
    name: "myAccountDetails",
};
//
</script>
<style></style>
