/**
 * Basic Editable table supports input text, selection, checkbox, remove, add functions, as well as text sorting and paging
 * Created by Zhang,Hang on 11/23/2016.
 */
function Error(number, message) {
    this.number = number;
    this.message = message;
}

/**
 * ServiceEditableTable Control class support basic editing function for table data, including adding, delete, update functions,
 * as well as the text sorting and paging functions.
 *
 * @param {Object} options: initial options.
 *                 -{String} table: editable table DOM element id.
 *                 -{String} addButton: table add row button element id.
 *                 -{Array<String>} columnClass: the DOM class values for each columns in one row.
 *                 -{Array<String>} initialColumnValue: the initial values for each columns in one row.
 *                 -{Function} undateCallBackFunction: call back function to update data to VUE.
 *                 -{Function} removeCallBackFunction: call back function to remove data to VUE.
 *                 -{Object} dialog: dialog object setting for warning message before row deletion.
 *                 -{Array<Object>} selectOptions:Object type options for selection data.
 *                          -{int} columnIndex: columnIndex of selection union.
 *                          -{Array<id, text>} options: pairs of selection data: id & value.
 *
 * @constructor
 */
function ServiceEditableTable(options) {

    /* constant area */

    /**
     * constant for class
     */
    var class_inner_uuid = 'inner_uuid';

    var class_inner_checkbox = 'inner_checkbox';

    var class_inner_select = 'inner_select';

    var class_actions = 'actions';

    var class_adding = 'adding';

    this.defaultOptions = {
        dialog: {
            wrapper: '#dialog',
            cancelButton: '#dialogCancel',
            confirmButton: '#dialogConfirm'
        }
    }

    this.options = options;
    this.dataTable = {};

    this.xmlDoc = document.implementation.createDocument("", "", null);
    this.ser = new XMLSerializer();

    // Checking constructor initial parameter:<code> options </code>
    if (!options) {
        throw new Error(101, "input parameter options can not be null");
    }
    if (!options.table) {
        throw new Error(102, "options attr:[table] should be set to set table DOM element id");
    }
    if (!options.addButton) {
        throw new Error(103, "options attr:[addButton] should be set to set add button DOM element id");
    }
    if (!options.columnClass) {
        throw new Error(104, "options attr:[columnClass] should be set to set add button DOM element id");
    }
    if (!options.initialColumnValue) {
        throw new Error(105, "options attr:[initialColumnValue] should be set to set add button DOM element id");
    }
    if (!options.undateCallBackFunction) {
        throw new Error(107, "options attr:[initialColumnValue] should be set to set add button DOM element id");
    }
    if (!options.removeCallBackFunction) {
        throw new Error(108, "options attr:[initialColumnValue] should be set to set add button DOM element id");
    }
    if (!options.dialog) {
        this.options.dialog = this.defaultOptions.dialog;
    }

    /**
     * Initialize the dataTable.
     */
    this.initialize = function () {
        this
            .setVars()
            .events();
    },

    /**
     * [Internal method] copying the values from initial parameter <code>options</code> to Class attribute.
     * @Return this Class instance.
     */
        this.setVars = function () {
            this.$table = $(this.options.table);
            this.$addButton = $(this.options.addButton);
            // dialog
            this.dialog = {};
            this.dialog.$wrapper = $(this.options.dialog.wrapper);
            this.dialog.$cancel = $(this.options.dialog.cancelButton);
            this.dialog.$confirm = $(this.options.dialog.confirmButton);
            return this;
        },

    /**
     * Refresh this dataTable, including destroying the exist one and build new one for new data.
     * Call this method when binding data is changed.
     */
        this.refreshTable = function () {
            var _self = this;
            setTimeout(function () {
                if ($.fn.dataTable.isDataTable($(_self.options.table))) {
                    // In  case table already exist, destroy the exist one and then build new one.
                    _self.dataTable.destroy();
                    _self.build();
                } else {
                    _self.build();
                }
            }, 0);

        },

        this.build = function () {
            this.dataTable = this.$table.DataTable({
                "language": {
                    "decimal": "",
                    "emptyTable": "没有数据",
                    "info": "显示 _START_ 到 _END_   /共_TOTAL_ 条数据",
                    "infoEmpty": "显示 0 条数据",
                    "infoFiltered": "(   找到 _MAX /共 _ total 条数据)",
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
                },
                aoColumns: this.generateAoColumns()
            });
            this.initTableSelectValue();
            return this;
        },

    /**
     * When table is build, init set the selection elements
     */
        this.initTableSelectValue2 = function () {
            var _self = this;
            this.$table.find('tr').each(function (i) {
                if(i == 0){
                    // skip table header.
                    return;
                }
                var $row = $(this);
                $row.children('td').each(function(j){
                    var $cell = $(this);
                    if(!$cell.hasClass(class_inner_select)){
                        return;
                    }
                    var options = _self.filterSelectOptionByIndex(j);
                    if (!options) {
                        throw new Error(109, 'the select options should be set at intial proper [columnIndex] with value:' + i);
                    }
                    var rawValue = $cell.text();
                    var selectHtmlUnion = _self.generateSelectHtml(options, rawValue);
                    $cell.html(selectHtmlUnion);
                    $cell.find("select").addClass("disabled", "disabled");
                });
            });
        },

    /**
     * When table is build, init set the selection elements with options
     */
        this.initTableSelectValue = function () {
            if(!this.options.selectOptions  || this.options.selectOptions.length == 0){
                // In case no selection columns, then return directly.
                return;
            }
            var _self = this;
            var columnLength = _self.dataTable.columns()[0].length;
            var rowLength = _self.dataTable.rows()[0].length;
            for (var i = 0; i < _self.options.selectOptions.length; i++) {
                var selectOption = _self.options.selectOptions[i];
                for(var j = 0; j < rowLength; j++){
                    var $cell = _self.dataTable.cell(j,_self.options.selectOptions[i].columnIndex);
                    var selectHtmlUnion = _self.generateSelectHtml(selectOption.options, $cell.data());
                    $cell.data(selectHtmlUnion);
                    //$cell.find("select").addClass("disabled", "disabled");
                }
            }
        },



        this.generateAoColumns = function () {
            var aoColumns = [];
            for (var i = 0; i < this.options.columnClass.length; i++) {
                if (class_actions == this.options.columnClass[i]) {
                    aoColumns = aoColumns.concat([
                        { "bSortable": false }
                    ]);
                } else {
                    aoColumns = aoColumns.concat(['']);
                }
            }
            ;
            return aoColumns;
        },

    /**
     * Wrap method to define all the actions methods, including adding, delete, update, save.
     */
        this.events = function () {
            var _self = this;
            this.$table.on( 'page.dt', function (e) {
                var info = _self.dataTable.page.info();
                console.log(info);

            });
            this.$table
                .on('click', 'a.save-row', function (e) {
                    e.preventDefault();
                    _self.rowSave($(this).closest('tr'));
                })
                .on('click', 'a.cancel-row', function (e) {
                    e.preventDefault();
                    _self.rowCancel($(this).closest('tr'));
                })
                .on('click', 'a.edit-row', function (e) {
                    e.preventDefault();
                    _self.rowEdit($(this).closest('tr'));
                })
                .on('click', 'a.remove-row', function (e) {
                    e.preventDefault();
                    var $row = $(this).closest('tr');

                    $.magnificPopup.open({
                        items: {
                            src: _self.options.dialog.wrapper,
                            type: 'inline'
                        },
                        preloader: false,
                        modal: true,
                        callbacks: {
                            change: function () {
                                _self.dialog.$confirm.on('click', function (e) {
                                    e.preventDefault();
                                    _self.rowRemove($row);
                                    $.magnificPopup.close();
                                });
                            },
                            close: function () {
                                _self.dialog.$confirm.off('click');
                            }
                        }
                    });
                });

            this.$addButton.on('click', function (e) {
                e.preventDefault();
                _self.rowAdd();
            });

            this.dialog.$cancel.on('click', function (e) {
                e.preventDefault();
                $.magnificPopup.close();
            });
            return this;
        },

    /**
     * Check the initial parameter: <code>options</code> by comparing the <code>columnClass</code> model
     * and <code>initialColumnValue</code> model.
     *
     */
        this.generateInitalValue = function () {
            // compare initial value and initial column value
            if (this.options.initialColumnValue.length == this.options.columnClass.length) {
                return this.options.initialColumnValue;
            }
            if (this.options.initialColumnValue.length + 1 == this.options.columnClass.length) {
                // in case "action" column value is skipped
                var initColumnValue = this.options.initialColumnValue;
                var i = this.getIndexOfActions();
                initColumnValue.splice(i, 0, '');
                return initColumnValue;
            }
            if (this.options.initialColumnValue.length + 2 == this.options.columnClass.length) {
                // in case "action" column value is skipped
                var initColumnValue = this.options.initialColumnValue;
                var i = this.getIndexOfActions();
                initColumnValue.splice(i, 0, '');
                var j = this.getIndexOfInnerUUID();
                initColumnValue.splice(j, 0, j);
                return initColumnValue;
            }
            throw new Error(106, '[columnClass] and [initialColumnValue] numbers are not consistence');
        },

    /**
     * [Internal method] get the UUID union column index in the row.
     */
        this.getIndexOfInnerUUID = function () {
            for (var i = 0; i < this.options.columnClass.length; i++) {
                if (class_inner_uuid == this.options.columnClass[i]) {
                    return i;
                }
            }
        },

    /**
     * [Internal method] get the Actions area column index in the row.
     */
        this.getIndexOfActions = function () {
            for (var i = 0; i < this.options.columnClass.length; i++) {
                if (class_actions == this.options.columnClass[i]) {
                    return i;
                }
            }
        },

    /**
     * Row data add function, is direct handler function when click "add" icon in table actions area.
     * to create a new editable data row to datatable with default processing buttons.
     */
        this.rowAdd = function () {
            this.$addButton.attr({ 'disabled': 'disabled' });
            var actions,
                data,
                $row;
            actions = [
                '<a href="#" class="hidden on-editing save-row"><i class="fa fa-save"></i></a>',
                '<a href="#" class="hidden on-editing cancel-row"><i class="fa fa-times"></i></a>',
                '<a href="#" class="on-default edit-row"><i class="fa fa-pencil"></i></a>',
                '<a href="#" class="on-default remove-row"><i class="fa fa-trash-o"></i></a>'
            ].join(' ');
            var rowData = [];
            var initColumnValue = this.generateInitalValue();
            for (var i = 0; i < this.options.columnClass.length; i++) {
                var hitFlag = false;
                if (class_inner_uuid == this.options.columnClass[i]) {
                    hitFlag = true;
                    rowData = rowData.concat([0]);
                }
                if (class_inner_select == this.options.columnClass[i]) {
                    hitFlag = true;
                    rowData = rowData.concat([initColumnValue[i]]);
                }
                if (class_inner_checkbox == this.options.columnClass[i]) {
                    hitFlag = true;
                    rowData = rowData.concat([initColumnValue[i]]);
                }
                if (class_actions == this.options.columnClass[i]) {
                    hitFlag = true;
                    rowData = rowData.concat([actions]);
                }
                if (!hitFlag) {
                    rowData = rowData.concat([initColumnValue[i]])
                }
            }

            data = this.dataTable.row.add(rowData);
            $row = this.dataTable.row(data[0]).nodes().to$();
            $row.addClass(class_adding);
            for (var i = 0; i < this.options.columnClass.length; i++) {
                if (class_inner_uuid == this.options.columnClass[i]) {
                    $row.find('td:eq(' + i + ')').addClass(class_inner_uuid);
                }
                if (class_inner_checkbox == this.options.columnClass[i]) {
                    $row.find('td:eq(' + i + ')').addClass(class_inner_checkbox);
                }
                if (class_inner_select == this.options.columnClass[i]) {
                    $row.find('td:eq(' + i + ')').addClass(class_inner_select);
                }
                if (class_actions == this.options.columnClass[i]) {
                    $row.find('td:eq(' + i + ')').addClass(class_actions);
                }
            }
            this.rowEdit($row);
            this.dataTable.order([0, 'asc']).draw(); // always show fields
        },

    /**
     * Row data cancel function, is direct handler function when click "cancel" icon in table actions area.
     * @param $row current row DOM element.
     */
        this.rowCancel = function ($row) {
            var _self = this,
                $actions,
                i,
                data;
            if ($row.hasClass(class_adding)) {
                this.rowRemove($row);
            } else {
                data = this.dataTable.row($row.get(0)).data();
                this.dataTable.row($row.get(0)).data(data);
                $actions = $row.find('td.actions');
                if ($actions.get(0)) {
                    this.rowSetActionsDefault($row);
                }
                this.dataTable.draw();
            }
        },

    /**
     * Logic to get TRUE or FALSE check box value from parsing the selection DOM element, including all the scenarios of selection DOM elements.
     * @param tdElement: selection DOM elements.
     * @param data: OPTIONAL value, when this value is set as TRUE or FALSE manually, then the return value will be set and skip the other logic.
     */
        this.getCheckboxValue = function (tdElement, data) {
            if (data == true || data == false) {
                return data;
            }
            if (tdElement.find('input:eq(0)').attr("checked") == "checked") {
                return true;
            }
            if (tdElement.find('input:eq(0)').attr("checked") == "true") {
                return true;
            }
            if (tdElement.find('input:eq(0)').attr("checked") == "on") {
                return true;
            }
            if (tdElement.find('input:eq(0)').attr("checked") == true) {
                return true;
            }
            return false;
        },

    /**
     * Row data edit function.
     * @param $row current processing row DOM element.
     */
        this.rowEdit = function ($row) {
            var _self = this,
                data;
            data = this.dataTable.row($row.get(0)).data();
            $row.children('td').each(function (i) {
                var $this = $(this);
                var hitFlag = false;
                if ($this.hasClass(class_inner_uuid)) {

                } else {
                    if ($this.hasClass(class_actions)) {
                        hitFlag = true;
                        _self.rowSetActionsEditing($row);
                    }
                    if ($this.hasClass(class_inner_checkbox)) {
                        // In case the checkbox input for boolean value
                        hitFlag = true;
                        var checkBoxValue = _self.getCheckboxValue($this, data[i]);
                        if (checkBoxValue == true) {
                            $this.html('<input type="checkbox" checked>');
                        } else {
                            $this.html('<input type="checkbox">');
                        }
                    }
                    if ($this.hasClass(class_inner_select)) {
                        // In case the checkbox input for boolean value
                        hitFlag = true;
                        var options = _self.filterSelectOptionByIndex(i);
                        if (!options) {
                            throw new Error(109, 'the select options should be set at intial proper [columnIndex] with value:' + i);
                        }
                        var selectHtmlUnion = _self.generateSelectHtml(options, data[i]);
                        console.log(selectHtmlUnion);
                        $this.html(selectHtmlUnion);
                    }
                    if (!hitFlag) {
                        // In case the normal input value for text
                        $this.html('<input type="text" class="form-control input-block" value="' + data[i] + '"/>');
                    }
                }
            });
        },


        this.filterSelectOptionByIndex = function (index) {
            if (!this.options.selectOptions) {
                return null;
            }
            for (var i = 0; i < this.options.selectOptions.length; i++) {
                if (!this.options.selectOptions[i].columnIndex) {
                    throw new Error(108, 'the field:[columnIndex] should be setted in [selectOptions] arrays');
                }
                if (this.options.selectOptions[i].columnIndex == index) {
                    return this.options.selectOptions[i].options;
                }
            }
        },

    /**
     * Function to generate selection DOM elements from initial options.
     * @param options: selection options.
     * @param initValue: init selected value.
     */
        this.generateSelectHtml = function (options, initValue) {
            var selectElement = this.generatedSelectElement(options, initValue);
            var htmlContent = this.ser.serializeToString(selectElement);
            return htmlContent;
        },

    /**
     * [Internal method]: Core logic to generate selection DOM elements from initial options.
     * @param options: selection options.
     * @param initValue: init selected value.
     */
        this.generatedSelectElement = function (options, initValue) {
            // Add li element
            var selectElement = this.xmlDoc.createElement("select");
            var _self = this;
            if (options != null) {
                for (var i = 0; i < options.length; i++) {
                    var optionElement = _self.xmlDoc.createElement("option");
                    optionElement.setAttribute("value", options[i].id);
                    optionElement.appendChild(_self.xmlDoc.createTextNode(options[i].text));
                    if (initValue == options[i].id) {
                        optionElement.setAttribute("selected", "selected");
                    }
                    selectElement.appendChild(optionElement);
                }
            }
            return selectElement;
        },


    /**
     * Row data save function, is direct handler function when click "save" icon in table actions area.
     * @param $row current row DOM element.
     */
        this.rowSave = function ($row) {
            var _self = this,
                $actions,
                values = [];

            var tmpUUID;
            // Get table values firstly.
            values = $row.find('td').map(function () {
                var $this = $(this);
                var hitFlag = false;
                // Case union of UUID
                if ($this.hasClass(class_inner_uuid)) {
                    hitFlag = true;
                    // record the value of record uuid
                    tmpUUID = $.trim($this.find('input').val());
                    if ($row.hasClass(class_adding)) {
                        // In case a new row, then generate ramdom UUID from JavaScript side.
                        tmpUUID = genUUID();
                        return 0;
                    } else {
                        return $this.text();
                    }
                }
                // Case union of actions
                if ($this.hasClass(class_actions)) {
                    hitFlag = true;
                    _self.rowSetActionsDefault($row);
                    return _self.dataTable.cell(this).data();
                }
                // Case union of checkbox.
                if (!hitFlag && $this.hasClass(class_inner_checkbox)) {
                    hitFlag = true;
                    return $.trim($this.find('input').val());
                }
                // Case union of selection.
                if (!hitFlag && $this.hasClass(class_inner_select)) {
                    return $.trim($this.find('select').val());
                }
                // Case union of normal input
                if (!hitFlag) {
                    return $.trim($this.find('input').val());
                }
            });
            // In case new row
            if ($row.hasClass(class_adding)) {
                this.$addButton.removeAttr('disabled');
                $row.removeClass(class_adding);
                //this.datatable.row($row.get(0)).remove();
            }

            // Set the value back to table
            this.dataTable.row($row.get(0)).data(values);
            // Add the display html elements to table
            $row.children('td').each(function (i) {
                var $this = $(this);
                // Case union of UUID, Set the uuid value to DOM element.
                if ($this.hasClass(class_inner_uuid)) {
                    //$this.text(values[i]);
                    $this.html(values[i] + '<input type="hidden" class="' + class_inner_uuid + '" value="' + tmpUUID + '"/>');
                }
                // Case union of select.
                if ($this.hasClass(class_inner_select)) {
                    var options = _self.filterSelectOptionByIndex(i);
                    if (!options) {
                        throw new Error(109, 'the select options should be set at intial proper [columnIndex] with value:' + i);
                    }
                    var selectHtmlUnion = _self.generateSelectHtml(options, values[i]);
                    $this.html(selectHtmlUnion);
                    $(this).find("select").val(values[i]);
                    $(this).find("select").addClass("disabled", "disabled");
                    //$this.html('<select><option value="1" >conversion</option><option value="2" selected>value</option><option value="3">default</option></select>');
                    //$(this).find("select").val(values[i])
                }
                // Case union of checkbox.
                if ($this.hasClass(class_inner_checkbox)) {
                    var checkBoxValue = $this.text();
                    if (checkBoxValue == "true" || checkBoxValue == "on") {
                        $this.html('<input type="checkbox" disabled="true" checked>');
                    } else {
                        $this.html('<input type="checkbox" disabled="true"  >');
                    }
                }
            });
            // Callback functions to Set row values to VUE list var.
            this.options.undateCallBackFunction(values, tmpUUID);
            $actions = $row.find('td.actions');
            if ($actions.get(0)) {
                this.rowSetActionsDefault($row);
            }
            this.dataTable.draw();
        },

    /**
     * Row data remove function, which is direct handler function when click "remove" icon in table actions area.
     * @param $row current row DOM element.
     */
        this.rowRemove = function ($row) {
            var _self = this;
            if ($row.hasClass(class_adding)) {
                this.$addButton.removeAttr('disabled');
            }
            // delete row from datatable.
            this.dataTable.row($row.get(0)).remove().draw();
            var values = [];
            var tmpUUID;
            $row.find('td').each(function (i) {
                var $this = $(this);
                if ($this.hasClass(class_inner_uuid)) {
                    // record the value of record uuid
                    tmpUUID = $.trim($this.find('input').val());
                }
            });
            // Callback functions to remove the row from VUE list var.
            this.options.removeCallBackFunction(tmpUUID);

        },


        this.rowSetActionsEditing = function ($row) {
            $row.find('.on-editing').removeClass('hidden');
            $row.find('.on-default').addClass('hidden');
        },

        this.rowSetActionsDefault = function ($row) {
            $row.find('.on-editing').addClass('hidden');
            $row.find('.on-default').removeClass('hidden');
        }

}
