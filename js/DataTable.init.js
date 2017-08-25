/**
 * Basic table supports text sorting and paging
 * Created by Zhang,Hang on 11/23/2016.
 */

function ServiceDataTable(table){
    this.table = table;
    this.dataTable = {};

    this.refreshTable = function(){
        var _self = this;

        setTimeout(function () {
            _self.build();
        }, 0);

    },

    /**
     * build a new data table or refresh datatable
     * @returns {{}|*|jQuery}
     */
    this.build = function(){
        if ($.fn.dataTable.isDataTable($(this.table))) {
            // In  case table already exist
            this.datatable.destroy();
            this.datatable = $(this.table).DataTable({
                "language": {
                    "decimal": "",
                    "emptyTable": "没有数据",
                    "info": "显示 _START_ 到 _END_   /共_TOTAL_ 条数据",
                    "infoEmpty": "显示 0 条数据",
                    "infoFiltered": "(总共 _MAX_ 条数据)",
                    "infoPostFix": "",
                    "thousands": ",",
                    "lengthMenu": "显示 _MENU_ 条",
                    "loadingRecords": "数据加载中...",
                    "processing": "处理...",
                    "search": "搜索:",
                    "zeroRecords": "找不到相关数据",
                    "paginate": {
                        "first": "首页",
                        "last": "尾页",
                        "next": "下一页",
                        "previous": "前一页"
                    }
                }
            });
        } else {
            this.datatable = $(this.table).DataTable({
                "language": {
                    "decimal": "",
                    "emptyTable": "没有数据",
                    "info": "显示 _START_ 到 _END_   /共_TOTAL_ 条数据",
                    "infoEmpty": "显示 0 条数据",
                    "infoFiltered": "(总共 _MAX_ 条数据)",
                    "infoPostFix": "",
                    "thousands": ",",
                    "lengthMenu": "显示 _MENU_ 条",
                    "loadingRecords": "数据加载中...",
                    "processing": "处理...",
                    "search": "搜索:",
                    "zeroRecords": "找不到相关数据",
                    "paginate": {
                        "first": "首页",
                        "last": "尾页",
                        "next": "下一页",
                        "previous": "前一页"
                    }
                }
            });
        }
        return this;
    },

    this.deleteRow = function($row){

    }
}