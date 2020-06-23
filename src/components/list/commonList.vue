<template>
    <div id="components-form-search">
        <a-form
                class="ant-advanced-search-form"
                :form="form"
                @submit="emitSearch"
                >
            <el-row :gutter="10">
                <template v-for="(item, index) in searchItems">

                    <el-col :span="overFlow === true ? 12 :4"
                            :style="{ display: index < count ? 'block' : 'none' }">
                        <a-form-item v-if="item.type==='checkbox'" :wrapper-col="{span:24}">
                            <a-checkbox
                                    v-decorator="[`${item.name}`, { valuePropName: 'checked',initialValue:item.defaultValue || false  }]"
                            >
                                {{item.label}}
                            </a-checkbox>
                        </a-form-item>
                        <a-form-item v-else>
                            <!-- 渲染input -->
                            <a-input
                                    v-decorator="[`${item.name}`,{rules:item.required ? [{required:true,message:`请填写${item.label}`}]:[]}]"
                                    allowClear
                                    :placeholder="item.label"
                                    v-if="item.type === 'text'"
                                    :disabled='item.disabled'
                            >

                            </a-input>
                            <!-- 渲染普通下拉框 -->
                            <a-select
                                    allowClear
                                    showSearch
                                    :placeholder="item.label"
                                    :defaultActiveFirstOption="false"
                                    :showArrow="true"
                                    :mode="item.mode || 'default'"
                                    :disabled='item.disabled'
                                    :maxTagCount="2"
                                    :filterOption="filterOption"
                                    v-decorator="[`${item.name}`,{rules:item.required ? [{required:true,message:`请选择${item.label}`}]:[],initialValue:item.defaultValue}]"
                                    v-if="item.type === 'select'"
                            >
                                <template v-if="item.options.length">
                                    <a-select-option v-for="d in item.options" :key="d.key">
                                        {{d.value}}
                                    </a-select-option>
                                </template>
                            </a-select>

                            <!-- 渲染带远程搜索功能的下拉框 -->
                            <a-select
                                    showSearch
                                    allowClear
                                    :placeholder="item.label"
                                    :defaultActiveFirstOption="false"
                                    :showArrow="true"
                                    :filterOption="false"
                                    v-decorator="[`${item.name}`,{rules:item.required ? [{required:true,message:`请选择${item.label}`}]:[]}]"
                                    v-if="item.type === 'remoteSelect'"
                                    :disabled='item.disabled'
                                    @search="(value) =>remoteSearchOptions(item, value)"
                                    @dropdownVisibleChange="(open) => open && remoteSearchOptions(item,'')"
                                    @select="(value,option)=>value && handleSelect(item,value)"
                                    :options="item.options || []"
                            >
                            </a-select>

                            <a-select
                                    showSearch
                                    allowClear
                                    :placeholder="item.label"
                                    :defaultActiveFirstOption="false"
                                    :showArrow="true"
                                    :filterOption="filterOption"
                                    v-decorator="[`${item.name}`,{rules:item.required ? [{required:true,message:`请选择${item.label}`}]:[]}]"
                                    v-if="item.type === 'selectCop'"
                                    @search="(value) =>copSearchOptions(item, value)"
                                    @dropdownVisibleChange="(open) => open && copSearchOptions(item,'')"
                                    @select="(value,option)=>value && handleSelect(item,value)"
                                    :options="item.options || []"
                            >
                            </a-select>

                            <!-- 渲染日期范围选择 -->
                            <a-range-picker
                                    allowClear
                                    :placeholder="[`${item.label}起`,`${item.label}止`]"
                                    v-decorator="[`${item.name}`,{rules:[{type:'array'}],initialValue:item.defaultValue}]"
                                    :showTime="item.showTime"
                                    :ranges="{'今天':[moment().startOf('day'),moment().endOf('day')],'本月':[moment().startOf('month'),moment().endOf('day')],'一个月内':[moment().subtract(30, 'day'),moment().endOf('day')],'三个月内':[moment().subtract(90, 'day'),moment().endOf('day')]}"
                                    v-if="item.type === 'date'"
                            >
                            </a-range-picker>

                            <!-- 渲染级联下拉框 -->
                            <a-cascader
                                    v-if="item.type === 'cascader'"
                                    allowClear
                                    :placeholder="item.label"
                                    v-decorator="[`${item.name}`,{rules:item.required ? [{required:true,message:`请选择${item.label}`}]:[]}]"
                                    :options="item.options"
                                    :showSearch="{filter}"
                                    changeOnSelect/>
                            <smart-city-selector
                                v-if="item.type === 'city'"
                                :unmatchReturn="false"
                                v-decorator="[`${item.name}`,{rules:item.required ? [{required:true,message:`请选择${item.label}`}]:[]}]"
                                ></smart-city-selector>
                        </a-form-item>
                    </el-col>
                </template>
                <!-- <el-col :span="overFlow === true ? 12 :8" style="text-align: right;padding-right:30px;"> -->
                <el-col :span="overFlow === true ? 12 :4" style="text-align: right;margin:4px 0 16px 0;">
                    <el-button type="primary" size="medium" @click="(e) => emitSearch(pageName)">查询</el-button>
                    <el-button size="medium" @click="handleReset">重置</el-button>
                    <el-button size="small" type="text" v-if="searchItems.length > 6" @click="expand = !expand">
                        {{expand?'收起':'展开'}}
                    </el-button>
                </el-col>

                <template v-if="searchPlan">
                    <el-col :span="4">
                        <a-form-item :wrapper-col="{span:16}">
                            <a-checkbox
                                v-decorator="[`saveParams`, { valuePropName: 'checked',initialValue:false  }]"
                                @change='saveParamsOption'
                            >
                                保存为查询方案
                            </a-checkbox>
                        </a-form-item>
                    </el-col>
                </template>

                <!-- 判断当前页面是否有快捷查询 -->
                <el-col :span="24" v-if="searchParams.length>0 && isRefish">
                    <template >
                        <template style="margin-top:8px;" v-for="(tag,index) in searchParams">
                            <el-tag
                                closable
                                size="small"
                                effect="dark"
                                style="margin-right:10px;cursor:pointer;transition:0s!important"
                                @click="handleClickTag(tag,index)"
                                @close='handleCloseTag(index,tag)'
                                @dblclick.native="(e)=>dbHandleClickTag(tag,index,e)"
                            >
                                {{tag.paramsName=='查询方案'?'查询方案'+Number(index+1):tag.paramsName}}
                            </el-tag>
                            <!-- <el-input
                                class="input-new-tag"
                                v-else
                                v-model="tag.paramsName"
                                :ref="'paramsName'+index"
                                size="mini"
                                @keyup.enter.native="handleInputConfirm(tag,index)"
                            >
                            </el-input> -->
                        </template>
                    </template>
                </el-col>
            </el-row>
        </a-form>
        <div class="search-result-list">
            <el-row :gutter="10">
                <div class='slotAction'>
                    <div style="margin-left:5px;">
                        <slot name="leftActions" v-bind:rows="selectedRows"></slot>
                    </div>
                    <div>
                        <slot name="rightActions"></slot>
                    </div>
                </div>
            </el-row>
            <!-- 添加记录 -->
            <el-table :data="dataList"
                      fit
                      :size="tableCss.size || 'medium'"
                      :border="tableCss.border"
                      :stripe="tableCss.stripe"
                      :header-row-style="tableCss.headerRowStyle"
                      :header-cell-style="tableCss.headerCellStyle"
                      @selection-change="handleSelectionChange"
                      @row-contextmenu="handleMenu"
                      style="width:100%">
                <el-table-column type="index" label="序号" width="50"></el-table-column>

                <template v-for="col in columns">
                    <!-- 渲染多级表头(暂只支持2级) -->
                    <template v-if="col.children">
                        <el-table-column :label="col.title" header-align='center'>
                            <template v-for="subCol in col.children">
                                <el-table-column
                                        type="selection"
                                        width="50"
                                        v-if="subCol.type==='selection'">
                                </el-table-column>

                                <!-- 导入图片 -->
                                <template v-else-if="subCol.type==='image'">
                                    <el-table-column
                                            :key="subCol.key"
                                            :property="subCol.key"
                                            :label="subCol.title"
                                            :width="subCol.width"
                                            :fixed="subCol.fixed"
                                            :sortable="subCol.sortable"
                                    >
                                        <template slot-scope="scope">
                                            <el-image
                                                    v-if="!!scope.row[subCol.key]"
                                                    style="width: 30px; height: 40px;"
                                                    :src="renderImgUrl(subCol,scope.row)"
                                                    :preview-src-list="renderImgList(subCol,scope.row)">
                                            </el-image>
                                        </template>
                                    </el-table-column>
                                </template>

                                <!-- 单选按钮 -->
                                <template v-else-if="subCol.type==='radio'">
                                    <el-table-column
                                            :key="subCol.key"
                                            :property="subCol.key"
                                            :label="subCol.title"
                                            :width="subCol.width"
                                            :fixed="subCol.fixed"
                                    >
                                        <template slot-scope="scope">
                                            <el-radio v-model="radio" :label="scope.$index" class="handleRadio"
                                                      @change="radioChange(scope.row)"></el-radio>
                                        </template>
                                    </el-table-column>
                                </template>

                                <template v-else-if="!!subCol.slotRender">
                                    <el-table-column
                                            :key="subCol.key"
                                            :property="subCol.key"
                                            :label="subCol.title"
                                            :width="subCol.width"
                                            :fixed="subCol.fixed"
                                            :sortable="subCol.sortable"
                                            :formatter="subCol.formatter"
                                            :show-overflow-tooltip="subCol.showOverflowTooltip"
                                    >
                                        <template slot-scope="scope">
                                            <span v-html="subCol.slotRender(scope.row)"></span>
                                        </template>
                                    </el-table-column>
                                </template>

                                <template v-else-if="subCol.key !== 'operation'">
                                    <el-table-column
                                            :key="subCol.key"
                                            :property="subCol.key"
                                            :label="subCol.title"
                                            :width="subCol.width"
                                            :fixed="subCol.fixed"
                                            :sortable="subCol.sortable"
                                            :formatter="subCol.formatter"
                                            :show-overflow-tooltip="subCol.showOverflowTooltip"
                                    >
                                    </el-table-column>
                                </template>

                                <el-table-column v-else
                                                 :property="subCol.key"
                                                 :label="subCol.title"
                                                 :width="subCol.width"
                                                 :fixed="subCol.fixed"
                                                 :key="subCol.key"
                                >
                                    <template slot-scope="scope">
                                        <template v-for="(action,index) in rowActions">
                                            <el-button :key="index"
                                                       v-if="!action.conditions  && checkPermission(action.permission,scope.row)"
                                                       type="text"
                                                       @click="() => handleTableAction(action.type, scope.row)">
                                                {{action.text}}
                                            </el-button>
                                            <el-button :key="index"
                                                       v-else-if="(!action.conditions || action.conditions.every(condition => condition.value.includes(scope.row[condition.key]))) && checkPermission(action.permission,scope.row)"
                                                       type="text"
                                                       @click="() => handleTableAction(action.type, scope.row)">
                                                {{action.text}}
                                            </el-button>

                                        </template>

                                    </template>
                                </el-table-column>
                            </template>
                        </el-table-column>
                    </template>
                    <!-- 渲染非多级表头 -->
                    <template v-else>
                        <el-table-column
                                type="selection"
                                width="50"
                                v-if="col.type==='selection'">
                        </el-table-column>

                        <el-table-column
                                type="expand"
                                v-else-if="col.type==='expand'"
                                :key="col.key"
                                width='50'
                        >
                            <template slot-scope="scope">
                                <div v-html="col.slotRender(scope.row)" v-if="col.slotRender"></div>
                                <el-table v-if="col.slotTable" :data="scope['row'][col.slotTable.dataColumn]" stripe
                                          :style="{width:'100%',marginLeft:'50px',marginRight:columns.find(it=>it.key==='operation').width+'px'}">
                                          <!-- style="width:80%;margin-left:50px;"> -->
                                          <!-- style="width:80%;margin:8px;"> -->
                                    <el-table-column type="index" label="序号" width="50"></el-table-column>
                                    <el-table-column
                                            :key="column.key"
                                            :property="column.key"
                                            :label="column.title"
                                            :formatter="column.formatter"
                                            :width="column.width"
                                            v-for="column in col.slotTable.columns"
                                    >
                                    </el-table-column>
                                </el-table>
                            </template>
                        </el-table-column>

                        <template v-else-if="col.type==='select'" >
                            <el-table-column
                                    :key="col.key"
                                    :property="col.key"
                                    :label="col.title"
                                    :width="col.width"
                                    :fixed="col.fixed"
                                    :sortable="col.sortable"
                            >
                                <template slot-scope="scope">
                                    <a-select
                                        :value='scope.row[col.key]' 
                                        style="width: 120px" 
                                        @change='(val)=>handleChangeSel(col.key,val,scope.row)' 
                                        :disabled='!!col.conditions&&!(col.conditions && col.conditions.value.find(it=>it===scope.row[col.conditions.key]))'
                                    >
                                        <a-select-option v-for="item in col.dataList" :key="item.id">{{item.name}}</a-select-option>
                                    </a-select>
                                </template>
                            </el-table-column>
                        </template>

                        <!-- 导入图片 -->
                        <template v-else-if="col.type==='image'">
                            <el-table-column
                                    :key="col.key"
                                    :property="col.key"
                                    :label="col.title"
                                    :width="col.width"
                                    :fixed="col.fixed"
                                    :sortable="col.sortable"
                            >
                                <template slot-scope="scope">
                                    <el-image
                                            v-if="!!scope.row[col.key]"
                                            style="width: 30px; height: 40px;"
                                            :src="renderImgUrl(col,scope.row)"
                                            :preview-src-list="renderImgList(col,scope.row)">
                                    </el-image>
                                </template>
                            </el-table-column>
                        </template>

                        <!-- 单选按钮 -->
                        <template v-else-if="col.type==='radio'">
                            <el-table-column
                                    :key="col.key"
                                    :property="col.key"
                                    :label="col.title"
                                    :width="col.width"
                                    :fixed="col.fixed"
                            >
                                <template slot-scope="scope">
                                    <el-radio v-model="radio" :label="scope.$index" class="handleRadio"
                                              @change="radioChange(scope.row)"></el-radio>
                                </template>
                            </el-table-column>
                        </template>

                        <template v-else-if="!!col.slotRender">
                            <el-table-column
                                    :key="col.key"
                                    :property="col.key"
                                    :label="col.title"
                                    :width="col.width"
                                    :fixed="col.fixed"
                                    :sortable="col.sortable"
                                    :formatter="col.formatter"
                                    :show-overflow-tooltip="col.showOverflowTooltip"
                            >
                                <template slot-scope="scope">
                                    <span v-html="col.slotRender(scope.row)"
                                          @click="columnClick(scope.row,col,col.key)"></span>
                                </template>
                            </el-table-column>
                        </template>

                        <template v-else-if="col.key !== 'operation'">
                            <el-table-column
                                    :key="col.key"
                                    :property="col.key"
                                    :label="col.title"
                                    :width="col.width"
                                    :fixed="col.fixed"
                                    :sortable="col.sortable"
                                    :formatter="col.formatter"
                                    :show-overflow-tooltip="col.showOverflowTooltip"
                            >
                            </el-table-column>
                        </template>

                        <el-table-column v-else
                                         :property="col.key"
                                         :label="col.title"
                                         :width="col.width"
                                         :fixed="col.fixed"
                                         :key="col.key"
                        >
                            <template slot-scope="scope">
                                <!-- 如果数量大于3，则3以后的都放在下拉框内（包括3）  -->
                                <template v-if="rowActions.filter(action=>checkAvaliable(scope.row, action)).length<=3">
                                    <span v-for="(action,index) in rowActions.filter(action=>(checkAvaliable(scope.row, action)))" :key="index" style="padding:0 5px">
                                        <el-button :key="index"
                                                v-allow="action.actionType || ''"
                                                v-if="!action.conditions  && checkPermission(action.permission,scope.row)"
                                                type="text" @click="() => handleTableAction(action.type, scope.row)">
                                            {{action.text}}
                                        </el-button>
                                        <el-button :key="index"
                                                v-allow="action.actionType || ''"
                                                v-else-if="(!action.conditions || action.conditions.every(condition => condition.value.includes(scope.row[condition.key]))) && checkPermission(action.permission,scope.row)"
                                                type="text" @click="() => handleTableAction(action.type, scope.row)">
                                            {{action.text}}
                                        </el-button>
                                    </span>
                                </template>

                                <template v-else>
                                    <span v-for="(action,index) in rowActions.filter(action=>(checkAvaliable(scope.row, action))).slice(0,2)" :key="index" style="padding:0 5px">
                                        <el-button :key="index"
                                                v-allow="action.actionType || ''"
                                                v-if="!action.conditions  && checkPermission(action.permission,scope.row)"
                                                type="text" @click="() => handleTableAction(action.type, scope.row)">
                                            {{action.text}}
                                        </el-button>
                                        <el-button :key="index"
                                                v-allow="action.actionType || ''"
                                                v-else-if="(!action.conditions || action.conditions.every(condition => condition.value.includes(scope.row[condition.key]))) && checkPermission(action.permission,scope.row)"
                                                type="text" @click="() => handleTableAction(action.type, scope.row)">
                                            {{action.text}}
                                        </el-button>
                                    </span>
                                    <template v-if="rowActions.filter(action=>(checkAvaliable(scope.row, action))).length>3">
                                        <a-dropdown style="margin-left:5px;">
                                            <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                                                更多操作<a-icon type="down" />
                                            </a>
                                            <a-menu slot="overlay">
                                                <a-menu-item :key="index" @click="() => handleTableAction(action.type, scope.row)" v-for="(action,index) in rowActions.filter(action=>(checkAvaliable(scope.row, action))).slice(2,rowActions.filter(action=>(checkAvaliable(scope.row, action))).length)" >
                                                    <el-button :key="index"
                                                        v-allow="action.actionType || ''"
                                                        size="mini"
                                                        v-if="!action.conditions  && checkPermission(action.permission,scope.row)"
                                                        type="text">
                                                        {{action.text}}
                                                    </el-button>
                                                    <el-button :key="index"
                                                        v-allow="action.actionType || ''"
                                                        size="mini"
                                                        v-else-if="(!action.conditions || action.conditions.every(condition => condition.value.includes(scope.row[condition.key]))) && checkPermission(action.permission,scope.row)"
                                                        type="text">
                                                        {{action.text}}
                                                    </el-button>
                                                </a-menu-item>
                                            </a-menu>
                                        </a-dropdown>
                                    </template>
                                </template>
                                <!-- <template v-for="(action,index) in rowActions">
                                    <el-button :key="index"
                                               v-allow="action.actionType || ''"
                                               v-if="!action.conditions  && checkPermission(action.permission,scope.row)"
                                               type="text" @click="() => handleTableAction(action.type, scope.row)">
                                        {{action.text}}
                                    </el-button>
                                    <el-button :key="index"
                                               v-allow="action.actionType || ''"
                                               v-else-if="(!action.conditions || action.conditions.every(condition => condition.value.includes(scope.row[condition.key]))) && checkPermission(action.permission,scope.row)"
                                               type="text" @click="() => handleTableAction(action.type, scope.row)">
                                        {{action.text}}
                                    </el-button>
                                </template> -->

                            </template>
                        </el-table-column>
                    </template>

                </template>
            </el-table>

            <a-modal
                title="保存查询方案"
                :visible="visible"
                destroyOnClose
                width='400px'
                @ok="handleSaveParamsName"
                @cancel="cancelSaveParams"
            >
                <el-row>
                  <el-col :span="6" class="formLabel">方案名称：</el-col>
                  <el-col :span="16">
                        <a-input placeholder="请输入方案名称" v-model="params_Name" style="width:100%;" />
                  </el-col>
                </el-row>
            </a-modal>


            <el-pagination
                    v-if="needPagination"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pagination.currentPage"
                    :page-sizes="pagination.pageSizesOptions"
                    :page-size="pagination.defaultPageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="pagination.total">
            </el-pagination>

            <el-row :gutter="10" style="text-align:center;margin:10px 0;">
                <el-col :span="24">
                    <slot name='bottomActions'></slot>
                </el-col>
            </el-row>
        </div>

    </div>
</template>

<script>
    import Bus from 'components/eventBus/eventBus'
    import moment from 'moment'
    import smartCitySelector from "@/components/comboSelector/smartCitySelector"
    import {mapMutations, mapState,mapGetters} from 'vuex'

    export default {
        name: "common-list",
        data() {
            return {
                // form: this.$form.createForm(this),
                searchItems: [],
                columns: [],
                dataList: [],
                rowActions: [],
                colSpan: 8,
                selectedRows: [],
                pagination: {
                    pageSizesOptions: [10, 20, 50, 100],
                    defaultPageSize: 20,
                    currentPage: 1,
                    total: 0
                },
                moment,
                showSlot: false,
                expand: false,
                role: [],
                org: {
                    cityId: 0,
                    warehouseId: 0,
                    serviceId:0
                },
                radio: '',
                tableCss: {
                    size: 'medium',
                    border: true,
                    stripe: false,
                    'headerRowStyle': {},
                    'headerCellStyle': {}
                },
                isdb:false,
                isRefish:true,
                searchParamsList:[],
                searchPlan:false,
                visible:false,
                params_Name:'',
                save_params:[],
                isRefresh:false
            }
        },
        components:{
            smartCitySelector
        },
        props: {
            schema: {
                type: Object,
                required: true
            },
            tableData: {
                type: Array,
                default: () => []
            },
            total: {
                type: Number,
                default: 0
            },
            currentPage: {
                type: Number,
                default: 0
            },
            initOptions: {
                type: Object
            },
            pageName: {
                type: String
            },
            initParams: {
                type: Object
            },
            defaultPageSize: {
                type: Number
            },
            tableHeight: {
                type: Number
            },
            tableStyle: {
                type: Object
            },
            needPagination: {
                type: Boolean,
                default:true
            }
        },
        created() {
            let _this = this
            this.form = this.$form.createForm(this, {
                name: 'form',
                onValuesChange(_, values) {
                    _this.isRefresh = true
                },
            });

            this.searchPlan = this.schema.searchPlan;
            this.searchItems = this.schema.searchItems;
            this.columns = this.schema.columns;
            this.rowActions = this.schema.rowActions;
            this.dataList = this.tableData;
            this.pagination.total = this.total;
            if (this.defaultPageSize) {
                this.pagination.defaultPageSize = this.defaultPageSize
            }
            if (this.initOptions) {
                const initKeys = Object.keys(this.initOptions)
                initKeys.forEach(key => {
                    const item = this.searchItems.find(it => it.name === key)
                    if (item) {
                        item.options = this.initOptions[key]
                    }
                })
            }
            if (this.tableStyle) {
                Object.assign(this.tableCss, this.tableStyle)
            }
            this.remoteSearchOptions = this._.debounce(this.remoteSearchOptions, 300)
        },
        mounted() {
            Bus.$on('triggerSearch', (type = '') => {
                this.emitSearch(type)
            })
            this.role = this.chooseRoleInfoList.roleCodes.map(it => it.code)
            const {cityId,warehouseId,serviceId} = this.getUserContext()
            this.org.cityId = cityId
            this.org.warehouseId = warehouseId
            this.org.serviceId = serviceId
            if (this.initParams && Object.keys(this.initParams).length) {
                this.initSearchParams(this.initParams)
            }
            // 查寻到搜索方案
            // 先看vuex里面有没有，如果有就直接取，没有就调用接口
            const data = {
                path:this.$route.name,
                userId:this.$store.state.user.userInfo.userId,
                cityId,
                warehouseId
            }
            this.getSearchParams(data)
        },
        beforeDestroy() {
            Bus.$off('triggerSearch', this.emitSearch)
        },
        computed: {
            ...mapState('searchParams',['userSearchPrarams']),
            ...mapGetters('searchParams',['getSearchParams']),
            searchParams(){
                const {warehouseId,cityId} = this.getUserContext()
                const userId = this.$store.state.user.userInfo.userId
                const path = this.$route.name
                if(this.userSearchPrarams && this.userSearchPrarams.length){
                    let s = this.userSearchPrarams.find(it=>{
                        if(it){
                            return it.userId==userId && it.path == path && it.warehouseId == warehouseId && it.orgId == cityId
                        }else{
                            return false
                        }
                    })
                    if(s){
                        return s.params
                    }else{
                        return []
                    }
                }else{
                    return []
                }
            },
            count() {
                return this.searchItems.length > 6 ? (this.expand ? this.searchItems.length : 6) : this.searchItems.length
            },
            calcHeight() {
                if (this.tableHeight) {
                    return this.tableHeight
                }
                const baseHeightMap = {
                    'mini': 53,
                    'small': 57,
                    'medium': 61,
                    'default': 67
                }
                const baseHeight = baseHeightMap[this.tableCss.size || 'default']
                return baseHeight * this.pagination.defaultPageSize + 18
            }
        },
        watch: {
            schema() {
                this.clean();
                this.searchPlan = this.schema.searchPlan;
                this.searchItems = this.schema.searchItems;
                this.columns = this.schema.columns;
                this.rowActions = this.schema.rowActions;
            },
            initParams: {
                handler(val) {
                    if (val && Object.keys(val).length) {
                        this.initSearchParams(val)
                    }
                },
                deep: true
            },
            tableData(val) {
                this.dataList = [];
                this.dataList = val;
            },
            total(val) {
                this.pagination.total = val;
            },
            currentPage(val) {
                this.pagination.currentPage = val;
            },
            initOptions(val) {
                if (val) {
                    const initKeys = Object.keys(val)
                    initKeys.forEach(key => {
                        const item = this.searchItems.find(it => it.name === key)
                        if (item) {
                            this.$set(item, 'options', val[key])
                        }
                    })
                }
            },
            chooseRoleInfoList(val) {
                this.role = val.roleCodes.map(it => it.code)
                this.org.cityId = val.orgId
                this.org.warehouseId = val.warehouseId
                const {serviceId} = this.getUserContext()
                this.org.serviceId = serviceId
            },
            tableStyle(val) {
                Object.assign(this.tableCss, val)
            }
        },
        methods: {
            ...mapMutations('searchParams',['saveParams','delParams','saveParamsName']),
            initSearchParams(params = {}) {
                const initKeys = Object.keys(params)
                initKeys.forEach(key => {
                    const item = this.searchItems.find(it => it.name === key)
                    if (!item) {
                        delete params[key]
                    }
                })
                setTimeout(() => {
                    this.form.setFieldsValue(params)
                    this.emitSearch(this.pageName || '')
                }, 0)
            },
            remoteSearchOptions(item, value) {
                let parentValue = null
                if (item.parentItem) {
                    parentValue = this.form.getFieldValue(item.parentItem)
                    if (parentValue === undefined || parentValue === null || parentValue === '') {
                        this.$set(item, 'options', [])
                        this.$message.info(`请先输入${item.label}`)
                        return
                    }
                }
                if (item.dataSource) {
                    const {cityId, userId, orgId, warehouseId,serviceId,orgType} = this.getUserContext()
                    item.dataSource(value, {cityId, userId, orgId, warehouseId,serviceId,orgType},parentValue).then(data => {
                        this.$set(item, 'options', data)
                    }).catch(e => {
                        console.log(`更新下拉数据失败，原因:${e}`)
                    })
                }
            },

            copSearchOptions(item, value) {
                if (item.dataSource && (!item.options || item.options.length === 0)) {
                    const {cityId, userId, orgId, warehouseId,serviceId,orgType} = this.getUserContext()
                    item.dataSource(value, {cityId, userId, orgId, warehouseId,serviceId,orgType}).then(data => {
                        this.$set(item, 'options', data)
                    }).catch(e => {
                        console.log(`更新下拉数据失败，原因:${e}`)
                    })
                } else if (item.dropRefresh) {
                    const {cityId, userId, orgId, warehouseId,serviceId,orgType} = this.getUserContext()
                    item.dataSource(value, {cityId, userId, orgId, warehouseId,serviceId,orgType}).then(data => {
                        this.$set(item, 'options', data)
                    }).catch(e => {
                        console.log(`更新下拉数据失败，原因:${e}`)
                    })
                }
            },
            handleSelect(item, value) {
                if (item.select) {
                    const {cityId, userId, orgId, warehouseId} = this.getUserContext()
                    item.select(value, {cityId, userId, orgId, warehouseId})
                }

            },
            emitSearch(type) {
                if (type !== this.pageName) return;
                let pageParams = {};
                pageParams.pageNum = this.pagination.currentPage;
                pageParams.pageSize = this.pagination.defaultPageSize;
                if(this.isRefresh){
                    pageParams.pageNum = 1
                    this.pagination.currentPage = 1;
                }
                this.form.validateFields((error, values) => {
                    if (!error) {
                        this.$emit(`search`, {...values, ...pageParams})
                        this.isRefresh = false
                    }
                })
            },
            handleInput(e) {
                if (e) {
                    e.preventDefault()
                    const val = e.target.value
                    if (val) {
                        this.showSlot = true
                    } else {
                        this.showSlot = false
                    }
                }
            },
            filterOption(input, option) {
                return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
            },
            emitEmpty(fieldName) {
                this.form.resetFields([fieldName]);
                this.showSlot = false
            },
            handleReset() {
                this.form.resetFields();
            },
            filter(inputValue, path) {
                return (path.some(option => (option.label).toLowerCase().indexOf(inputValue.toLowerCase()) > -1));
            },
            clean() {
                this.searchItems = [];
                this.dataList = [];
                this.columns = [];
                this.pagination.currentPage = 1
                this.pagination.defaultPageSize = 20
                this.pagination.total = 0;
            },
            handleSizeChange(val) {
                this.pagination.defaultPageSize = val
                this.emitSearch(this.pageName)
            },
            handleCurrentChange(val) {
                this.pagination.currentPage = val
                this.emitSearch(this.pageName)
            },
            handleTableAction(type, row) {
                this.$emit('rowAction', {type: type, data: row})
            },
            handleSelectionChange(val) {
                this.selectedRows = val;
                this.$emit('select-change', this.selectedRows)
            },
            checkPermission(permissionFn, row) {
                if (typeof permissionFn === 'function') {
                    return permissionFn(row, this.role, this.org)
                }
                return true
            },
            radioChange(row) {
                this.$emit('single-select', row)
            },
            renderImgUrl(col, row) {
                const imageUrl = row[col.key]
                if (!imageUrl) {
                    return
                } else {
                    const src = imageUrl.push ? imageUrl[0].cloudSrc : imageUrl
                    return col.formatter && col.formatter.apply ? col.formatter(row, col, src) : src
                }
            },
            renderImgList(col, row) {
                const imageUrl = row[col.key]
                if (!imageUrl) {
                    return
                } else {
                    const imgList = imageUrl.push ? imageUrl.map(it => it.cloudSrc) : [imageUrl]
                    return col.formatter && col.formatter.apply ? imgList.map(img => col.formatter(row, col, img)) : imgList
                }
            },
            columnClick(row, col, key) {
                if (col.click) {
                    this.$emit('handleClick', {row, key})
                }
            },
            handleMenu(row, column, event) {
                event.preventDefault();
                event.stopPropagation();
                const actions = this.schema.rowActions.filter(action => this.checkAvaliable(row, action))
                actions.length && this.$contextmenu({
                    items: actions.map(it => {
                        return {
                            label: it.text,
                            onClick:() => this.handleTableAction(it.type, row),
                            icon: it.icon || '',
                            minWidth:0,
                        }
                    }),
                    event,
                    customClass: "class-a",
                    minWidth:100
                })
            },
            checkAvaliable(row, action) {
                return (!action.actionType || this.btnPermissions.some(it => it.toLowerCase() === action.actionType)
                    ) && (!action.conditions || action.conditions.every(condition => condition.value.includes(row[condition.key]))
                    ) && this.checkPermission(action.permission, row)
            },
            handleChangeSel(key,val,row){
                const data = [key,val,row]
                this.$emit('handleChangeSel',data)
            },
            handleFormValue(obj={}) {
                const keys = Object.keys(obj)
                keys.forEach(key => {
                    if(key!='saveParams'){
                        const item = this.searchItems.find(it => it.name === key)
                        // if (item.type === 'date' && obj[key] && obj[key].length) {
                        if (item.type === 'date' && obj[key]) {
                            // obj[key] = obj[key].map(str => {
                            //     return moment(str,'YYYY-MM-DD HH:mm:ss')
                            // })
                            obj[key][0] = moment(obj[key][0]).startOf('day')
                            obj[key][1] = moment(obj[key][1]).endOf('day')
                        }
                    }
                })
                delete obj.saveParams
                return obj
            },
            handleClickTag(tag){
                this.isdb = false
                // let timeout = setTimeout(()=>{
                setTimeout(()=>{
                    if(this.isdb!=true){
                        const {value} = tag                
                        this.form.resetFields()
                        this.form.setFieldsValue(this.handleFormValue(value))
                        this.emitSearch(this.pageName)
                    }
                },300)
            },
            handleCloseTag(index,tag){
                const path = this.$route.name
                const userId = this.$store.state.user.userInfo.userId
                const {cityId,warehouseId} = this.getUserContext()
                const data={
                    path,
                    cityId,
                    warehouseId,
                    userId,
                    id:tag.id,
                    index
                }
                this.delParams(data)
            },
            dbHandleClickTag(tag,index){
                this.isdb = true
                this.isRefish = false
                this.$nextTick(()=>{
                    this.isRefish = true
                    this.$nextTick(()=>{
                        this.$refs['paramsName'+index][0].focus()
                    })
                })
            },
            // 保存
            // handleInputConfirm(tag,index){
            //     this.isRefish = false
            //     this.$nextTick(()=>{
            //         this.isRefish = true
            //     })
            //     const path = this.$route.name
            //     const userId = this.$store.state.user.userInfo.userId
            //     const {cityId,warehouseId} = this.getUserContext()
            //     const data={
            //         path,
            //         cityId,
            //         warehouseId,
            //         userId,
            //         id:tag.id,
            //         index,
            //         paramsName:tag.paramsName
            //     }
            //     this.saveParamsName(data)
            // },
            // 取消双击保存名字
            handleSaveParamsName(){
                if(!this.params_Name){
                    this.$message.warning('请输入方案名称')
                    return false
                }
                this.save_params[2].paramsName = this.params_Name
                this.saveParams(this.save_params)
                this.form.setFieldsValue({saveParams:false})
                this.visible = false
            },
            saveParamsOption(val){
                // 勾选时就出发保存
                if(val.target.checked){
                    this.form.validateFields((error, values) => {
                    if (!error) {
                        const initKeys = Object.keys(values)
                        initKeys.forEach(key => {
                            if(key!='saveParams'){
                                const item = this.searchItems.find(it => it.name === key)
                                if(item.type === 'date' && values[key] && values[key].length){
                                    values[key] = values[key].map(str => {
                                        return moment(str).format('YYYY-MM-DD')
                                    })
                                }
                            }
                        })
                        const {warehouseId,cityId} = this.getUserContext()
                        const params = [{warehouseId,cityId,userId:this.$store.state.user.userInfo.userId},this.$route.name,{
                            paramsName:'查询方案',
                            value:values
                        }]
                        this.save_params = params
                        this.visible = true
                        this.isRefish = false
                        this.$nextTick(()=>{
                            this.isRefish = true
                        })
                    }
                })
                }
            },
            cancelSaveParams(){
                this.visible = false
                this.form.setFieldsValue({saveParams:false})
            }
        },
        deactivated(){
            this.form.setFieldsValue({saveParams:false})
        }
    }
</script>

<style lang="less">
    #components-form-search .ant-advanced-search-form {
        padding: 24px;
        background: #fff;
        border: 1px solid #d9d9d9;
        border-radius: 6px;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);
    }

    #components-form-search .ant-advanced-search-form .ant-form-item {
        display: flex;
        margin-bottom: 10px;
    }

    #components-form-search .ant-advanced-search-form .ant-form-item-control-wrapper {
        flex: 1;
    }

    #components-form-search .ant-form {
        max-width: none;
    }

    #components-form-search .search-result-list {
        margin-top: 16px;
        border: 1px dashed #e9e9e9;
        border-radius: 6px;
        background-color: #fff;
        min-height: 200px;
        text-align: left;
        padding-top: 20px;
        padding-left: 10px;
        padding-right: 10px;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);
    }

    #components-form-search .search-result-list .el-row {
        margin-bottom: 10px;
    }

    #components-form-search .search-result-list .rightActions {
        text-align: right;
    }

    #components-form-search .search-result-list .slotAction{
        display: flex;
        justify-content: space-between;
        padding-right: 5px;
    }

    #components-form-search .ant-form-item-children {
        display: inline-block !important;
        width: 100% !important;
        > span {
            width: 100% !important;
        }
    }

    #components-form-search .handleRadio {
        .el-radio__label {
            display: none !important;
        }
    }

    #components-form-search .el-radio__label {
        display: none !important;
    }

    .el-table__header-wrapper {
        position: -webkit-sticky;
        position: sticky;
        top: -20px;
        z-index: 999;
    }

    .el-pagination {
        position: -webkit-sticky;
        position: sticky;
        background-color: #ffffff;
        bottom: -20px;
        z-index: 1;
    }
    .class-a > span[class^='Contextmenu_menu_item'] {
        height:24px;
    }
    
    .input-new-tag {
        // width: 120px;
        width: 120px;
        height: 24px!important;
        margin-right: 10px;
        vertical-align: bottom;
        >input{
            height: inherit!important;
            padding: 0 10px;
        }
    }

    .formLabel{
        display: flex;
        line-height: 32px;
    }
</style>