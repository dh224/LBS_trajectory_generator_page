<script setup>
import { ref ,reactive, onMounted} from 'vue'
import { EluiChinaAreaDht } from 'elui-china-area-dht'
import moment from 'moment'
import axios from "axios";
import { toTypeString } from '@vue/shared';
import { toRaw } from '@vue/reactivity'

const chinaData = new EluiChinaAreaDht.ChinaArea().chinaAreaflat
let pName;
let cityName;
const drawer2 = ref(false)
onMounted(()=>{
    axios.get(
        "http://localhost:8080/listAllPoiType"
    ).then((res)=>{
        let index = 0
        res.data.types.forEach(element => {
            options.push({
                key: index,
                value: element.subcategory
            })
        });
    }).catch((err)=>{
        console.log(err)
    })
})

// do not use same name with ref
const form = reactive({
    cityarea: '',
    timeinterval: "",
    Trajectorynumber: "",
})

const onSubmit = () => {
    let dueTime = timeValue.value[0]
    dueTime.setMinutes(dueTime.getMinutes() - dueTime.getTimezoneOffset());
    let dueTime2 = timeValue.value[1]
    dueTime2.setMinutes(dueTime2.getMinutes() - dueTime2.getTimezoneOffset());
    axios.post("http://localhost:8080/generate",{
    pname: pName.label,
    cityname: cityName.label,
    starttime: dueTime.toJSON().substr(0, 19).replace(/[T]/g, ' '),
    endtime: dueTime2.toJSON().substr(0, 19).replace(/[T]/g, ' '),
    trajectorysize: TraNum.value,
    pattern:dynamicValidateForm.domains
  }).then((res)=>{
      console.log(res);
  })
}

const count = ref(0)

function onCityChange(e) {
    pName = chinaData[e[0]]
    cityName = chinaData[e[1]]
    console.log(pName, cityName)
}
const timeValue = ref([
  new Date(2022, 10, 10, 10, 10),
  new Date(2022, 10, 11, 10, 10),
])
const value2 = ref([])
const shortcuts = [
  {
    text: 'Last week',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: 'Last month',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: 'Last 3 months',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
]
const TraNum = ref(1)
const handleNumberChange = (value) => {
  console.log(value)
}
const dynamicValidateForm = reactive({
  domains: [
  ],
})
const addDomain = () => {
  dynamicValidateForm.domains.push({
    key: Date.now(),
    pattern:[
        {
            attribute:{
                patternname:'new pattern name',
                maxage: 50,
                minage: 20,
                patternrate:1,
                drivingrate:5,
                genderrate:5,
            }
        },
        {
            workdayPattern:[
                {
                    index:0,
                    startTime:'',
                    endTime: '',
                    value:"",
                    commute:""
                },
            ]
        },{
            noworkdayPattern:[
                {
                    index:0,
                    startTime:'',
                    endTime: '',
                    value:"",
                    commute:""
                },
            ]
        }
    ],
  })
}
const showAllValue = () =>{
    dynamicValidateForm.domains.forEach(element => {
        console.log(element.value)
    });
}
const openDrawer = (domain)=>{
    openedPattern.domain = domain
    drawer2.value = true
}
const openedPattern = reactive({
  key:'',
  domain:{},
})
const options = [
]
const addNewTimeInWorkingday = ()=>{
  let leng = openedPattern.domain.pattern[1].workdayPattern.length
  openedPattern.domain.pattern[1].workdayPattern.push({
                    index:leng + 1,
                    startTime:'',
                    endTime: '',
                    value:"",
                    commute:""
  })
}
const addNewTimeInNoWorkingday = (d)=>{
  let leng = openedPattern.domain.pattern[2].noworkdayPattern.length
  openedPattern.domain.pattern[2].noworkdayPattern.push({
                    index:leng + 1,
                    startTime:'',
                    endTime: '',
                    value:"",
                    commute:""
  })
}
const commuteOptions = [
    {
        value: '不限',
        label: '不限',
    },
    {
        value: '短距离',
        label: '短距离',
    },
    {
        value: '中距离',
        label: '中距离',
    },
    {
        value: '长距离',
        label: '长距离',
    },
]
</script>
<template>
<el-form :model="form" label-width="120px" size="large">
<el-drawer
    v-model="drawer2"
    title="pattern design"
    :direction="direction"
    :before-close="handleClose"
    size="35%"
  >
  Pattern attribute        <el-divider />
      <el-form-item label="Pattern Name">
        <el-input v-model="openedPattern.domain.pattern[0].attribute.patternname" placeholder="Please input" />
    </el-form-item>
    <el-form-item label="Age Range">
      <el-input-number v-model="openedPattern.domain.pattern[0].attribute.minage" :min="1" :max="openedPattern.domain.pattern[0].attribute.maxAge" @change="handleNumberChange" />
      <el-input-number v-model="openedPattern.domain.pattern[0].attribute.maxage" :min="1" :max="80" @change="handleNumberChange" />
    </el-form-item>
    <div class="slider-demo-block">
        <span class="demonstration">pattern rate</span>
        <el-slider v-model="openedPattern.domain.pattern[0].attribute.patternrate"/>
    </div>
        <div class="slider-demo-block">
        <span class="demonstration">driving rate</span>
        <el-slider v-model="openedPattern.domain.pattern[0].attribute.drivingrate" :max="10"/>
    </div>
    <div class="slider-demo-block">
        <span class="demonstration">Gender distribution</span>
        <el-slider v-model="openedPattern.domain.pattern[0].attribute.genderrate" :max="10"/>
    </div>
        <el-divider />
    work day
     <el-divider />
    <el-form-item
      v-for="(d ,index) in openedPattern.domain.pattern[1].workdayPattern"
      :key="d.key"
      :label="'time quantum ' + (index + 1)"
    >
    <el-space wrap>
    <el-time-select
      v-model="d.startTime"
      :max-time="d.endTime"
      class="mr-4"
      style="width: 240px"
      placeholder="Start time"
      start="00:00"
      step="01:00"
      end="24:00"
    />
    <el-time-select
      v-model="d.endTime"
      :min-time="d.startTime"
      style="width: 240px"
      placeholder="End time"
      start="00:00"
      step="01:00"
      end="24:00"
    />
      <el-select
      v-model="d.value"
      multiple
      collapse-tags
      placeholder="Select POI Type"
      style="width: 240px"
      size="large"
    >
    <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-select
      v-model="d.commute"
      placeholder="Select Max Commute Range"
      style="width: 240px"
      size="large"
    >
    <el-option
        v-for="item in commuteOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>

    </el-space>
    </el-form-item>
    <el-form-item>
      <el-button align="center" color="#626aef" plain  @click="addNewTimeInWorkingday()">New</el-button>
    </el-form-item>
    no workingday
     <el-divider />
    <el-form-item
      v-for="(d ,index) in openedPattern.domain.pattern[2].noworkdayPattern"
      :key="d.key"
      :label="'time quantum ' + (index + 1)"
      :prop="'w.' + index + '.value'"
    >
    <el-space wrap>
      <el-time-select
      v-model="d.startTime"
      :max-time="d.endTime"
      class="mr-4"
      style="width: 240px"
      placeholder="Start time"
      start="00:00"
      step="01:00"
      end="24:00"
    />
    <el-time-select
      v-model="d.endTime"
      :min-time="d.startTime"
      style="width: 240px"
      placeholder="End time"
      start="00:00"
      step="01:00"
      end="24:00"
    />
      <el-select
      v-model="d.value"
      multiple
      collapse-tags
      placeholder="Select POI Type"
      style="width: 240px"
      size="large"
    >
    <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-select
      v-model="d.commute"
      placeholder="Select Max Commute Range"
      style="width: 240px"
      size="large"
    >
    <el-option
        v-for="item in commuteOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    </el-space>
    </el-form-item>
        <el-form-item>
      <el-button align="center" color="#626aef" plain  @click="addNewTimeInNoWorkingday()">New</el-button>
    </el-form-item>
  </el-drawer>
    <el-form-item label="City Area">
        <elui-china-area-dht isall :leave="2" @change="onCityChange"></elui-china-area-dht>  
    </el-form-item>
    <el-form-item label="Time interval">
            <el-date-picker
            v-model="timeValue"
            type="datetimerange"
            range-separator="To"
            start-placeholder="Start date"
            end-placeholder="End date"
            />
    </el-form-item >   
    <el-form-item label="Trajectory ">
      <el-input-number v-model="TraNum" :min="1" :max="50" @change="handleNumberChange" />
    </el-form-item>

    <el-form-item
      v-for="(domain, index) in dynamicValidateForm.domains"
      :key="domain.key"
      :label="'pattern ' + index"
      :prop="'domains.' + index + '.value'"
    >
      <el-button type="primary" size="large" style="margin-left: 16px" @click="openDrawer(domain)">
    {{domain.pattern[0].attribute.patternname}}
  </el-button>
    </el-form-item>
    <el-form-item>
        <el-button @click="addDomain">New Pattern</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">Create</el-button>
    </el-form-item>
  </el-form> 
</template>

<style scoped>
a {
  color: #42b983;
}
</style>
