<script setup>
import { ref ,reactive, onMounted} from 'vue'
import { EluiChinaAreaDht } from 'elui-china-area-dht'
import moment from 'moment'
import axios from "axios";
import { toTypeString } from '@vue/shared';
const chinaData = new EluiChinaAreaDht.ChinaArea().chinaAreaflat
let cityName;
let adName;
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
    cityname: cityName.label,
    adname : adName.label,
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
    cityName = chinaData[e[0]]
    adName = chinaData[e[1]]
    console.log(cityName, adName)
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
            }
        },
        {
            workdayPattern:[
                {
                    index:0,
                    value:"",
                    commute:""
                },
                                {
                    index:1,
                    value:"",
                    commute:""
                },
                                {
                    index:2,
                    value:"",
                    commute:""
                },
                                {
                    index:3,
                    value:"",
                    commute:""
                },
                                {
                    index:4,
                    value:"",
                    commute:""
                },
                                {
                    index:5,
                    value:"",
                    commute:""
                },                {
                    index:6,
                    value:"",
                    commute:""
                },
                                {
                    index:7,
                    value:"",
                    commute:""
                }
            ]
        },{
            noworkdayPattern:[
                {
                    index:0,
                    value:"",
                    commute:""
                },
                                {
                    index:1,
                    value:"",
                    commute:""
                },
                                {
                    index:2,
                    value:"",
                    commute:""
                },
                                {
                    index:3,
                    value:"",
                    commute:""
                },
                                {
                    index:4,
                    value:"",
                    commute:""
                },
                                {
                    index:5,
                    value:"",
                    commute:""
                },                {
                    index:6,
                    value:"",
                    commute:""
                },                {
                    index:7,
                    value:"",
                    commute:""
                }
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
  >
      <el-form-item label="Pattern Name">
        <el-input v-model="openedPattern.domain.pattern[0].attribute.patternname" placeholder="Please input" />
    </el-form-item>
    <el-form-item label="Age Range">
      <el-input-number v-model="openedPattern.domain.pattern[0].attribute.minage" :min="1" :max="openedPattern.domain.pattern[0].attribute.maxAge" @change="handleNumberChange" />
      <el-input-number v-model="openedPattern.domain.pattern[0].attribute.maxage" :min="1" :max="80" @change="handleNumberChange" />
    </el-form-item>
    <div class="slider-demo-block">
        <span class="demonstration">pattern rate</span>
        <el-slider v-model="openedPattern.domain.pattern[0].attribute.patternrate" />
    </div>
    <el-divider />
    work day
     <el-divider />
    <el-form-item
      v-for="(d ,index) in openedPattern.domain.pattern[1].workdayPattern"
      :key="d.key"
      :label="'Hour ' + index"
      :prop="'w.' + index + '.value'"
    >
      <el-select
      v-model="d.value"
      multiple
      collapse-tags
      placeholder="Select"
      style="width: 240px"
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
      placeholder="Select"
      style="width: 120px"
    >
    <el-option
        v-for="item in commuteOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    </el-form-item>
    noworkingday
     <el-divider />
    <el-form-item
      v-for="(d ,index) in openedPattern.domain.pattern[2].noworkdayPattern"
      :key="d.key"
      :label="'Hour ' + index"
      :prop="'w.' + index + '.value'"
    >
    <el-select
      v-model="d.value"
      multiple
      collapse-tags
      placeholder="Select"
      style="width: 240px"
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
      placeholder="Select"
      style="width: 120px"
    >
    <el-option
        v-for="item in commuteOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    </el-form-item>
  </el-drawer>
    <el-form-item label="City Area">
        <elui-china-area-dht isall :leave="3" @change="onCityChange"></elui-china-area-dht>  
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
      <el-button>Cancel</el-button>
    </el-form-item>
  </el-form> 
</template>

<style scoped>
a {
  color: #42b983;
}
</style>
