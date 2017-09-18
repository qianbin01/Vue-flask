let dataTables = DataTables.default;

Vue.component('tabel-detail', {
    template: '#tabel-detail-template',
    components: {dataTables},
    data: function () {
        return {
            tableData: [],
            dialogFormVisible: false,
            form: {
                name: '',
                index: ''
            },
            formType: 'create',
            formTitle: '添加数据'
        }
    },
    mounted: function () {
        this.getCategories();
    },
    methods: {
        getActionsDef: function () {
            let self = this;
            return {
                width: 5,
                def: [{
                    name: '添加数据',
                    handler() {
                        self.formType = 'create';
                        self.formTitle = '添加数据';
                        self.form.name = '';
                        self.form.index = '';
                        self.dialogFormVisible = true;
                    },
                    icon: 'plus'
                }]
            }
        },
        getPaginationDef: function () {
            return {
                pageSize: 10,
                pageSizes: [10, 20, 50]
            }
        },
        getRowActionsDef: function () {
            let self = this;
            return [{
                type: 'primary',
                handler(row) {
                    self.formType = 'edit';
                    self.form.name = row.name;
                    self.form.index = row.index;
                    self.formTitle = '编辑数据';
                    self.dialogFormVisible = true;
                },
                name: '编辑'
            }, {
                type: 'danger',
                handler(row) {
                    if (row.flag === 'true') {
                        self.$message.success("该信息不能删除！")
                    } else {
                        self.$confirm('确认删除该数据?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(function () {
                            let url = Flask.url_for("delete", {name: row.name, index: row.index});
                            axios.delete(url).then(function (response) {
                                self.getCategories();
                                self.$message.success("删除成功！")
                            }).catch(self.showError)
                        });

                    }
                },
                name: '删除'
            }]
        },
        getCategories: function () {
            let url = Flask.url_for("get_base_data");
            let self = this;
            axios.get(url).then(function (response) {
                self.tableData = response.data.results;
            });
        },
        createOrUpdate: function () {
            let self = this;
            if (self.form.name === '') {
                self.$message.error('数据不能为空！');
                return
            }
            if (self.formType === 'create') {
                let url = Flask.url_for("add");
                axios.post(url, {
                    name: self.form.name
                }).then(function (response) {
                    self.getCategories();
                    self.dialogFormVisible = false;
                    self.$message.success('添加成功！')
                }).catch(self.showError);
            } else {
                let url = Flask.url_for("update", {});
                axios.put(url, {
                    name: self.form.name,
                    index: self.form.index
                }).then(function (response) {
                    self.getCategories();
                    self.dialogFormVisible = false;
                    self.$message.success('修改成功！')
                }).catch(self.showError);
            }
        },
        showError: function (error) {
            let response = error.response;
            this.$message.error(response.data.message);
        }
    }
});

new Vue({
    el: '#vue-app'
});