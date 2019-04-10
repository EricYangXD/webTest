<template>
    <div style="width:100%;">

        <el-table
            :data="tableData"
            fit
            row-key="id"
            align="left"
        >
            <el-table-column
                sortable
                v-for="(item, index) in col"
                :key="`col_${index}`"
                :prop="dropCol[index].prop"
                :label="item.label"
            >
                <template slot-scope="scope">
                    <div
                        style="width:100%;height:100%;"
                        @click="handleEdit(scope.row)"
                    >
                        {{ scope.row[dropCol[index].prop]}}
                    </div>
                </template>
            </el-table-column>

        </el-table>
        <pre style="text-align: left">{{dropCol}}</pre>
        <hr>
        <pre style="text-align: left">{{tableData}}</pre>
    </div>
</template>
<script>
import Sortable from "sortablejs";
import { queryTableData, getTripDetail } from "api/api";

export default {
    data() {
        return {
            col: [
                {
                    label: "车辆ID",
                    prop: "assetid"
                },
                {
                    label: "行驶里程(KM)",
                    prop: "distance_sum"
                },
                {
                    label: "耗油量(L)",
                    prop: "fuel_used_sum"
                },
                {
                    label: "百公里油耗(L)",
                    prop: "bkmfuel_sum"
                },
                {
                    label: "低效率燃油耗费(元)",
                    prop: "lowfuel_sum"
                },
                {
                    label: "驾驶得分(%)",
                    prop: "score_avg"
                },
                {
                    label: "超经转燃油占比(%)",
                    prop: "pct_outside_sweet_zone_avg"
                },
                {
                    label: "超速平均值(KM/H)",
                    prop: "over_speed_avg"
                },
                {
                    label: "怠速消耗(L)",
                    prop: "idle_fuel_avg"
                }
            ],
            dropCol: [
                {
                    label: "车辆ID",
                    prop: "assetid"
                },
                {
                    label: "行驶里程(KM)",
                    prop: "distance_sum"
                },
                {
                    label: "耗油量(L)",
                    prop: "fuel_used_sum"
                },
                {
                    label: "百公里油耗(L)",
                    prop: "bkmfuel_sum"
                },
                {
                    label: "低效率燃油耗费(元)",
                    prop: "lowfuel_sum"
                },
                {
                    label: "驾驶得分(%)",
                    prop: "score_avg"
                },
                {
                    label: "超经转燃油占比(%)",
                    prop: "pct_outside_sweet_zone_avg"
                },
                {
                    label: "超速平均值(KM/H)",
                    prop: "over_speed_avg"
                },
                {
                    label: "怠速消耗(L)",
                    prop: "idle_fuel_avg"
                }
            ],
            tableData: []
        };
    },
    mounted() {
        this.columnDrop();
        this._queryTableData();
    },
    methods: {
        handleEdit(row) {
            let selectedVehicle = row;
            console.log(selectedVehicle);
        },
        _queryTableData() {
            //   let params = this.buildParams();
            const params =
                "start_ts=1524585600000&end_ts=1525190400000&model_no='J6','J7'";
            queryTableData("tripSearch", params)
                .then(res => {
                    this.tableData = res.data;
                    this.$nextTick(() => {
                        this.columnDrop();
                    });
                })
                .catch(e => {
                    this.$layer.msg(e);
                });
        },
        //列拖拽
        columnDrop() {
            const wrapperTr = document.querySelector(
                ".el-table__header-wrapper tr"
            );
            this.sortable = Sortable.create(wrapperTr, {
                animation: 180,
                delay: 0,
                onEnd: evt => {
                    const oldItem = this.dropCol[evt.oldIndex];
                    this.dropCol.splice(evt.oldIndex, 1);
                    this.dropCol.splice(evt.newIndex, 0, oldItem);
                }
            });
        }
    }
};
</script>
<style scoped>
</style>
