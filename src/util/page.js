class pageRecord {
    constructor(endAt) {
        this.endAt = endAt;
    }
}
class pageQuery {
    constructor(endpoint, additionalArgs) {
        this.endpoint = endpoint; //url such as https://account.tmysam.top/apps/minecraftInfo/api/get_balance_record.php
        this.additionalArgs = additionalArgs; //additional args such as dev=xxx
        this.pages = [];
    }
    push(page, endAt) {
        this.pages[page] = new pageRecord(endAt);
    }
    constructQueryString(page) {
        let query = this.endpoint + "?page=" + page;
        if (this.additionalArgs != null) {
            query += "&" + this.additionalArgs;
        }
        if (this.pages[page - 1] != null) {
            query += "&id=" + this.pages[page - 1].endAt;
        }
        return query;
    }
}

module.exports = { pageQuery, pageRecord };
