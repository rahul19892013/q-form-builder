<!-- eslint-disable space-before-function-paren -->
<!-- eslint-disable semi -->
<!-- eslint-disable semi -->
<script>
// // import axios from 'axios'

// // import APISettings from './components/ApiSettings'
import Users from './components/views/Users.vue'
import Actions from './components/views/Actions.vue'
import Companies from './components/views/Companies.vue'
import Categories from './components/views/Categories.vue'
import PreviewForm from './components/views/PreviewForm.vue'
import SubCategories from './components/views/SubCategories.vue'

export default {
  name: 'QMEApp',
  components: {
  Users,
  Actions,
  Companies,
  Categories,
  PreviewForm,
  SubCategories
  },
  data: function () {
    return {
      fields: [],
      fieldData: [],
      showDesignForm: false,
      fieldValues: [{}],
      tab: 'categories'
    }
  },
  methods: {
    /**
     * When a value is input into the rendered form, echo it to the debug line
     */
    onInput(val, id) {
      // console.debug(`${id}: ` + JSON.stringify(val))
    },
    /**
     * Determine the name of the Element object based on the 'field_type' of the field data object
     */
    getElement(field) {
      debugger
      const nameParts = field.field_type.split('_')
      for (let i = 0; i < nameParts.length; i++) {
        nameParts[i] = nameParts[i].charAt(0).toUpperCase() + nameParts[i].slice(1)
      }
      return nameParts.join('') + 'Element'
    },

    onShowDesignForm() {
      this.onResetViews()
      this.showDesignForm = true
    },

    onResetViews() {
      this.showDesignForm = false
    }
  },
  watch: {
    fields: {
      handler(val) {
        // console.log(val)
      },
      deep: true
    }
  }
}
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          <a href="http://127.0.0.1:5173/" style="color: white; text-decoration: none; width:auto;">Quote Me Easy Admin</a>
        </q-toolbar-title>
        <!-- <div>
        <marquee>Total Estimates: 1,02,211&nbsp;&nbsp;||&nbsp;&nbsp;New/Outstanding Estimates: 22,213&nbsp;&nbsp;||&nbsp;&nbsp;Submitted Estimates: 7,221&nbsp;&nbsp;||&nbsp;&nbsp;Accepted Estimates: 3,213&nbsp;&nbsp;||&nbsp;&nbsp;Ignore Estimates: 23,212</marquee>
      </div> -->
    </q-toolbar>
    </q-header>

    <q-page-container>
    <div class="q-pa-md">
    <div class="q-gutter-y-md" >
      <q-card>
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="categories" label="Categories" />
          <q-tab name="subCategories" label="Sub-Categories" />
          <q-tab name="actions" label="Actions" />
          <q-tab name="forms" label="Forms" />
          <q-tab name="designForms" label="Design Forms" />
          <q-tab name="companies" label="Companies" />
          <q-tab name="users" label="Users" />
          <q-tab name="estimateRequests" label="Estimate Requests" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="categories">
            <div class="text-h6">List Of Categories</div>
            <Categories/>
          </q-tab-panel>

          <q-tab-panel name="subCategories">
            <div class="text-h6">List Of Sub-Categories</div>
         <SubCategories/>
          </q-tab-panel>

          <q-tab-panel name="actions">
            <div class="text-h6">List Of Actions</div>
          <Actions/>
          </q-tab-panel>

          <q-tab-panel name="forms">
            <div class="text-h6">List Of Forms</div>
          </q-tab-panel>

          <q-tab-panel name="designForms">
            <PreviewForm/>
          </q-tab-panel>

          <q-tab-panel name="companies">
            <div class="text-h6">List Of Companies</div>
            <Companies/>
          </q-tab-panel>

          <q-tab-panel name="users">
            <div class="text-h6">List Of Users</div>
            <Users/>
          </q-tab-panel>

          <q-tab-panel name="estimateRequests">
            <div class="text-h6">List Of Estimate Requests</div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
  </div>
</q-page-container>
  </q-layout>
</template>

<style lang="stylus">
  .q-form-container
    max-width 820px
    margin auto

  .q-card
    width 100%

  .q-form
    width 100%
</style>
