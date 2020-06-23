<template>
  <div>
    <span class="operationTile">{{list.title}}</span>

    <el-row v-for="(item,index) in list.childrenMsg" :key="index" class="row">
      <el-col :span="2">
        <span style="fontSize:18px;">{{item.childTitle}}</span>
      </el-col>
      <el-col :span="22">
        <el-row>
          <el-col :span="4" v-for="(stap,index) in item.stap" :key="index">
            <div class="stapMsg">
              <div>
                <a-icon @click="handlePush(stap)" class="icon" :type="stap.icon" theme="twoTone" twoToneColor="#fff" style="fontSize:32px;marginBottom:15px;" />
                <span @click="handlePush(stap)" class="stap">{{stap.name}}</span>
                <span style="cursor:default;">{{stap.describe}}</span>
              </div>
              <a-icon type="swap-right" style="fontSize:35px;color:#6AB9FD" v-if="index<item.stap.length-1"/>
              <a-icon type="swap-right" style="fontSize:35px;color:#FFFFFF" v-if="index==item.stap.length-1"/>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Bus from "@/components/eventBus/eventBus.js"
export default {
  props: {
    list: {
      required: true,
      default:{
          title:'',
          children:{}
      }
    }
  },
  data() {
      return {
      }
  },
  methods: {
      handlePush(addtab){
          if(addtab.tabMsg.name != ""){
              Bus.$emit("handleTabsEdit",addtab.tabMsg,"add")
          }else{
            this.$message('暂无信息');
          }
      }
  },
};
</script>

<style scoped>
.row{
    display: flex;
    align-items: center;
    padding: 20px 0;
    margin: 20px 0;
  border-bottom: 1px solid #dddddd;
}

.operationTile {
  display: block;
  font-size: 20px;
  line-height: 55px;
  margin: 30px 0;
  font-family: pingFangSC-Regular, sans-serif;
}

.stap{
    cursor: pointer;
}

.stapMsg {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.stapMsg > div {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.icon{
    /* border: 1px solid black; */
    border-radius: 50%;
    padding: 18px;
    background-color: #448DF8;
}


.stapMsg > div >span {
    font-size: 10px;
}
</style>