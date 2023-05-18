<template>
  <div class="q-pa-md">
   <q-markup-table dark class="bg-black-15">
     <thead>
       <tr>
         <th class="text-left">Sr No.</th>
         <th class="text-right">Caption</th>
         <th class="text-right">Description</th>
         <th class="text-right">Data Type</th>
         <th class="text-right">Field Type</th>
         <th class="text-right">Is Required</th>
         <th class="text-right">Sequence</th>
         <th class="text-right">Min Length</th>
         <th class="text-right">Max Length</th>
         <th class="text-right">LookUp Id</th>
         <th class="text-right">Item Id</th>
         <th class="text-right">Action Id</th>
         <th class="text-right">Step Id</th>
         <th class="text-right">Step Title</th>
         <th class="text-right">Active</th>
         <th class="text-right">Created Date</th>
       </tr>
     </thead>
     <tbody>
       <tr v-for="(item,index) in records" :key="index">
         <td class="text-left" style="width:20%">{{ index+1 }}</td>
         <td class="text-right">{{ item.caption }}</td>
         <td class="text-right">{{ item.description }}</td>
         <td class="text-right">{{ item.dataType }}</td>
         <td class="text-right">{{ item.fieldType }}</td>
         <td class="text-right">{{ item.isRequired }}</td>
         <td class="text-right">{{ item.sequence }}</td>
         <td class="text-right">{{ item.minLength }}</td>
         <td class="text-right">{{ item.maxLength }}</td>
         <td class="text-right">{{ item.lookUpId }}</td>
         <td class="text-right">{{ item.itemId }}</td>
         <td class="text-right">{{ item.actionId }}</td>
         <td class="text-right">{{ item.stepId }}</td>
         <td class="text-right">{{ item.stepTitle }}</td>
         <td class="text-right">{{ item.isActive }}</td>
         <td class="text-right">{{ formatDate(item.created)}}</td>
       </tr>
     </tbody>
   </q-markup-table>
   <br/>
   <div class="bar error" v-if="errorMessage">{{ errorMessage }}</div>
 </div>
</template>
<script>

import axios from 'axios'
import APISettings from './ApiSettings'

export default ({
 name: 'fields-vue',
 data () {
   return {
     errorMessage: '',
     records: {}
   }
 },
 methods: {
   formatDate (date) {
     return new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(new Date(date))
   },
   showError (e) {
    if (typeof (e.response) !== 'undefined') {
     switch (e.response.status) {
       case 401:
       this.errorMessage = 'Unauthorized'
        break
       default:
       this.errorMessage = e.message
         break
     }
   } else {
     this.errorMessage = e.message
   }
       console.log(e)
   }
 },
 mounted () {
   this.errorMessage = ''
   axios.get(APISettings.baseURL + 'Fields/GetFields',
   {
       headers: APISettings.getHeaders()[0],
       params: APISettings.axiosParams()
   }).then(res => {
     this.records = res.data.data.items
   }).catch(e => {
     this.showError(e)
   })
}
})
</script>
<style scoped>

.error {
 padding: 10px;
 color: #ba3939;
 background: #ffe0e0;
 border: 1px solid #a33a3a;
}

</style>
