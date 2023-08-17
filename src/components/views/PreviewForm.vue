<!-- eslint-disable no-unused-vars -->
<!-- eslint-disable space-before-function-paren -->
<!-- eslint-disable semi -->
<!-- eslint-disable semi -->
<script>
import axios from 'axios'

import APISettings from '../../config/ApiSettings'
// import API_ADD_FIELDS from '../../config/apiEndpoints'
import QFormBuilder from './DesignForm.vue'
import {
  TextElement, ParagraphElement, CheckboxesElement, RadioElement, DateElement, TimeElement, DropdownElement,
  EmailElement, NameElement, SimpleNameElement, AddressElement, PhoneElement, FileElement, PaymentElement, TermsElement,
  PageBreakElement, SectionBreakElement
} from '../index'
import { errorNotification, successNotification } from '../../utilities/useShowNotification';

export default {
  name: 'DesignWorkflow',
  components: {
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
      title: '',
      fieldData: [],
      showDesignForm: false,
      fieldValues: [{}],
      lookupItems: [{}]
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
    },

    // eslint-disable-next-line space-before-blocks, space-before-function-paren
    saveSchema() {
      for (let index = 0; index < this.fields.length; index++) {
        this.fieldValues.push({
          cid: this.fields[index].cid,
          caption: this.fields[index].label,
          description: this.fields[index].field_options.description,
          sequence: 1,
          type: this.fields[index].field_type,
          required: this.fields[index].required,
          fieldOptions: typeof (this.fields[index].field_options.options) !== 'undefined'
                                ? this.fields[index].field_options.options : null,
          categoryId: localStorage.getItem('categoryId'),
          subCategoryId: localStorage.getItem('subCategoryId'),
          actionId: localStorage.getItem('actionsId'),
          dataTypeId: 2,
          isActive: true
        })
      }
        delete this.fieldValues[0]
        this.saveFields(this.fieldValues)
    },

    saveFields(fieldValues) {
      axios.post(APISettings.baseURL + 'Fields/AddField', { fields: fieldValues },
          {
            headers: APISettings.getHeaders()[0],
            params: APISettings.axiosParams()
          }).then(res => {
            if (res.data.data > 0) { this.saveLookups(fieldValues.filter((f) => f.fieldOptions != null), res.data.data) } else {
              errorNotification(res.data.message)
            }
          }).catch(e => {
            alert(e)
          })
    },

    saveLookups(lookups) {
      for (let lookUpIndex = 0; lookUpIndex < lookups.length; lookUpIndex++) {
        for (let lookUpItemIndex = 0; lookUpItemIndex < lookups[lookUpIndex].fieldOptions.length; lookUpItemIndex++) {
        this.lookupItems.push({
          cid: lookups[lookUpIndex].cid,
          text: lookups[lookUpIndex].fieldOptions[lookUpItemIndex].label,
          idValue: lookUpItemIndex + 1,
          categoryId: localStorage.getItem('categoryId'),
          subCategoryId: localStorage.getItem('subCategoryId'),
          actionId: localStorage.getItem('actionsId'),
          caption: lookups[lookUpIndex].caption,
          checked: lookups[lookUpIndex].fieldOptions[lookUpItemIndex].checked,
          isActive: true
        })
      }
      }
      delete this.lookupItems[0]
      axios.post(APISettings.baseURL + 'Lookups/AddLookup', { lookups: this.lookupItems },
          {
            headers: APISettings.getHeaders()[0],
            params: APISettings.axiosParams()
          }).then(res => {
            if (res.data.data > 0 || res.data.message === '') {
              successNotification('Form Designed Successfully For Gathering New Shade Netting Inputs')
            } else {
              errorNotification(res.data.message)
            }
          }).catch(e => {
            errorNotification(e)
          })
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
    <q-page-container>
      <q-page>

        <!-- form building -->
        <q-form-builder v-model="fields" />

        <q-separator />

        <!-- form rendering -->
        <div class="q-pa-md q-form-container">
          <h4>Form Rendering</h4>
          <div v-for="(field, index) in fields" :key="index">
            <component v-model="fieldData[field.cid]" @input="onInput" v-bind:is="getElement(field)" :label="field.label"
              :required="field.required" :field_options="field.field_options" :id="field.cid" :cid="field.cid"
              :ref="field.cid" debounce="500" />
          </div>
          <q-btn no-caps color="primary" label="Save" @click="saveSchema" />
        </div>
      </q-page>
    </q-page-container>
</template>

<style lang="stylus">
  .q-form-container
    max-width 820px
    margin auto
</style>
