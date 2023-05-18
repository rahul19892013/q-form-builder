<!-- eslint-disable semi -->
<!-- eslint-disable semi -->
<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          <a href="" style="color: white; text-decoration: none; ">Quote Me Easy</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <q-btn no-caps color="primary" label="Items" @click="onShowItems"/>&nbsp;
          <q-btn no-caps color="primary" label="Actions" @click="onShowActions"/>&nbsp;
          <q-btn no-caps color="primary" label="Lookups" @click="onShowLookups"/>&nbsp;
          <q-btn no-caps color="primary" label="Fields" @click="onShowFields"/>&nbsp;
        </q-toolbar-title>
        <!-- <div>Quasar v{{ $q.version }}</div> -->
        <div>
          <q-btn no-caps color="primary" label="Design Form" @click="onShowDesignForm"/>&nbsp;
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <items v-if="showItems"/>
      <actions v-if="showActions"/>
      <lookups v-if="showLookups"/>
      <fields v-if="showFields"/>
    </q-page-container>

    <q-page-container v-if="showDesignForm">
      <q-page>

        <!-- form building -->
        <q-form-builder v-model="fields" />

        <q-separator />

        <!-- form rendering -->
        <div class="q-pa-md q-form-container">
          <h4>Form Rendering</h4>
          <div v-for="(field, index) in fields" :key="index">
            <component v-model="fieldData[field.cid]" @input="onInput" v-bind:is="getElement(field)" :label="field.label" :required="field.required" :field_options="field.field_options" :id="field.cid" :cid="field.cid" :ref="field.cid" debounce="500" />
          </div>
          <q-btn no-caps color="primary" label="Save Schema" @click="saveSchema"/>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>

import { QFormBuilder, TextElement, ParagraphElement, CheckboxesElement, RadioElement, DateElement, TimeElement, DropdownElement, EmailElement, NameElement, SimpleNameElement, AddressElement, PhoneElement, FileElement, PaymentElement, TermsElement, PageBreakElement, SectionBreakElement } from '@/components/index'
import items from './components/Items.vue'
import actions from './components/Actions.vue'
import lookups from './components/Lookups.vue'
import fields from './components/Fields.vue'
import axios from 'axios'
import APISettings from './components/ApiSettings'

export default {
  name: 'SampleApp',
  components: {
    items,
    actions,
    lookups,
    fields,
    QFormBuilder,
    TextElement,
    ParagraphElement,
    CheckboxesElement,
    RadioElement,
    DateElement,
    TimeElement,
    DropdownElement,
    EmailElement,
    NameElement,
    SimpleNameElement,
    AddressElement,
    PhoneElement,
    FileElement,
    PaymentElement,
    TermsElement,
    PageBreakElement,
    SectionBreakElement
},
  data: function () {
    return {
      fields: [],
      fieldData: [],
      showDesignForm: false,
      showItems: false,
      showActions: false,
      showLookups: false,
      showFields: false,
      items: {}
    }
  },
  methods: {
    /**
     * When a value is input into the rendered form, echo it to the debug line
     */
    onInput (val, id) {
      // console.debug(`${id}: ` + JSON.stringify(val))
    },
    /**
     * Determine the name of the Element object based on the 'field_type' of the field data object
     */
    getElement (field) {
      const nameParts = field.field_type.split('_')
      for (let i = 0; i < nameParts.length; i++) {
        nameParts[i] = nameParts[i].charAt(0).toUpperCase() + nameParts[i].slice(1)
      }
      return nameParts.join('') + 'Element'
    },

    onShowDesignForm () {
      this.onResetViews()
      this.showDesignForm = true
    },

    onShowItems () {
      this.onResetViews()
      this.showItems = true
    },

    onShowActions () {
      this.onResetViews()
      this.showActions = true
    },

    onShowLookups () {
      this.onResetViews()
      this.showLookups = true
    },

    onShowFields () {
      this.onResetViews()
      this.showFields = true
    },

    onResetViews () {
      this.items = {}
      this.showDesignForm = false
      this.showItems = false
      this.showActions = false
      this.showLookups = false
      this.showFields = false
    },

    // eslint-disable-next-line space-before-blocks, space-before-function-paren
    saveSchema(){
      this.fields.forEach(element => {
        console.log(element)
        const data = {
                caption: element.label,
                description: element.field_options.description,
                dataType: element.field_type,
                fieldType: element.field_type,
                isRequired: element.required,
                itemId: 3,
                actionId: 7,
                isActive: true
        }
      axios.post(APISettings.baseURL + 'Fields/AddField', data,
   {
       headers: APISettings.getHeaders()[0],
       params: APISettings.axiosParams()
   }).then(res => {
    this.onShowFields()
     console.log(res)
   }).catch(e => {
     alert(e)
   })
  })
    }

  },
  watch: {
    fields: {
      handler (val) {
         console.log(val)
      },
      deep: true
    }
  }
}
</script>

<style lang="stylus">
  .q-form-container
    max-width 820px
    margin auto
</style>
