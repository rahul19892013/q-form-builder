<template>
  <div class="q-pa-md">
   <q-markup-table dark class="bg-black-15">
     <thead>
       <tr>
         <th class="text-left">Sr No.</th>
         <th class="text-right">Name</th>
         <th class="text-right">Description</th>
         <th class="text-right">ItemId</th>
         <th class="text-right">ActionId</th>
         <th class="text-right">Active</th>
         <th class="text-right">Created Date</th>
       </tr>
     </thead>
     <tbody>
       <tr v-for="(action,index) in records" :key="index">
         <td class="text-left" style="width:20%">{{ index+1 }}</td>
         <td class="text-right">{{ action.name }}</td>
         <td class="text-right">{{ action.description }}</td>
         <td class="text-right">{{ action.itemId }}</td>
         <td class="text-right">{{ action.id }}</td>
         <td class="text-right">{{ action.isActive }}</td>
         <td class="text-right">{{ formatDate(action.created)}}</td>
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
 name: 'actions-vue',
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
   axios.get(APISettings.baseURL + 'Actions/GetActions',
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
