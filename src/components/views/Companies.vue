<!-- eslint-disable space-before-function-paren -->
<!-- eslint-disable semi -->
<!-- eslint-disable semi -->
<script>
import axios from 'axios'

import APISettings from '../../config/ApiSettings'
import { getRequest, putRequest } from '../../services/api.services';
import { errorNotification, successNotification } from '../../utilities/useShowNotification';

export default {
  name: 'Companies',
  components: {},
  data: function () {
    return {
      filter: '',
      dialogHeaderText: null,
      companyDialog: false,
      editedIndex: -1,
      editedItem: {
        id: 0,
        name: '',
        website: '',
        registrationNumber: '',
        vatNumber: '',
        officeContactNumber: '',
        secondaryContactNumber: '',
        isActive: false
      },
      defaultItem: {
        id: 0,
        name: '',
        website: '',
        registrationNumber: '',
        vatNumber: '',
        officeContactNumber: '',
        secondaryContactNumber: '',
        isActive: false,
        created: '',
        createdBy: '',
        lastModified: '',
        lastModifiedBy: ''
      },
      columns: [
        {
          name: 'id',
          align: 'left',
          label: 'Id',
          field: 'id',
          sortable: true
        },
        {
          name: 'name',
          required: true,
          label: 'Name',
          align: 'left',
          field: row => row.name,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: 'website',
          label: 'Website',
          align: 'left',
          field: 'website',
          sortable: true,
          style: 'width: 50px'
        },
        { name: 'registrationNumber', align: 'left', label: 'Registration Number', field: 'registrationNumber', sortable: true },
        // { name: 'vatNumber', align: 'left', label: 'VAT Number', field: 'vatNumber', sortable: true },
        { name: 'officeContactNumber', align: 'left', label: 'Office ContactNumber', field: 'officeContactNumber', sortable: true },
        { name: 'secondaryContactNumber', align: 'left', label: 'Secondary ContactNumber', field: 'secondaryContactNumber', sortable: true },
        { name: 'isActive', align: 'left', label: 'Active', field: 'isActive', sortable: true },
        { name: 'created', align: 'left', label: 'Created', field: 'created', sortable: true },
        { name: 'lastModified', align: 'left', label: 'Modified', field: 'lastModified', sortable: true },
        { name: 'actions', label: 'Actions', feld: 'actions', align: 'center' }
      ],
      data: [{}]
    }
  },
  mounted() {
    this.getCompanies()
  },
  methods: {
    showAddItemDialog(text) {
      this.editedItem = Object.assign({}, this.defaultItem)
      this.dialogHeaderText = text
      this.companyDialog = true
    },
    onSubmit() {
      if (this.editedIndex > -1 && this.editedItem.id > 0) {
        this.updateCompany(this.editedItem)
      } else {
        this.addCompany(this.editedItem);
      }
    },
    getCompanies() {
      getRequest('Company/GetCompanies')
        .then((response) => {
          this.data = response
        });
    },
    updateCompany(company) {
      putRequest('Company/UpdateCompany', {
        company: {
          id: company.id,
          name: company.name,
          website: company.website,
          registrationNumber: company.registrationNumber,
          vatNumber: company.vatNumber,
          officeContactNumber: company.officeContactNumber,
          secondaryContactNumber: company.secondaryContactNumber,
          isActive: company.isActive
        }
      }).then((response) => {
        if (response.data.success) {
          successNotification(response.data.message);
          this.updateAddedOrEditedItem(response.data.data);
          Object.assign(this.data[this.editedIndex], this.editedItem);
          this.close();
        } else { errorNotification(response.data.message) }
      });
    },
    addCompany(company) {
      axios.post(APISettings.baseURL + 'Company/AddCompany', { company: { name: company.name, website: company.website, registrationNumber: company.registrationNumber, vatNumber: company.vatNumber, officeContactNumber: company.officeContactNumber, secondaryContactNumber: company.secondaryContactNumber, isActive: company.isActive } },
        {
          headers: APISettings.getHeaders()[0]
        }).then(response => {
          if (response.data.data) {
            successNotification(response.data.message);
            this.updateAddedOrEditedItem(response.data.data);
            this.data.push(this.editedItem);
            this.close();
          } else {
            errorNotification(response.data.message);
            this.companyDialog = true;
          }
        }).catch(e => {
          errorNotification(e)
        })
    },
    deleteCompany(company) {
      axios.delete(APISettings.baseURL + 'Company/DeleteCompany',
        {
          headers: APISettings.getHeaders()[0],
          data: { company: { id: company.id } }
        }).then(response => {
          if (response.data.success) {
            successNotification(response.data.message);
          } else {
            errorNotification(response.data.message);
          }
        }).catch(e => {
          errorNotification(e)
        })
    },
    deleteItem(item) {
      const index = this.data.indexOf(item);
      const text = 'Are you sure you want to delete this item?';
      if (confirm(text)) {
        this.deleteCompany(item);
        this.data.splice(index, 1);
      }
    },
    showEditItemDialog(item, text) {
      this.editedIndex = this.data.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogHeaderText = text;
      this.companyDialog = true;
    },
    close() {
      this.companyDialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    updateAddedOrEditedItem(data) {
      this.editedItem.id = data.id;
      this.editedItem.created = data.created;
      this.editedItem.lastModified = data.lastModified;
    },
    onReset() {
      this.editedItem = Object.assign({}, this.defaultItem)
    }
  }
}
</script>

<template>
  <q-page-container style="padding-top:10px;">
    <q-page>
      <div id="q-app">
        <div class="q-pa-sm q-gutter-sm">
          <q-table title="Companies" :data="data" :columns="columns" :filter="filter" row-key="id" binary-state-sort>
            <template v-slot:top-right>
              <q-tr>
                <q-td>
                  <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
                    <template v-slot:append>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </q-td>
                <q-td></q-td>
                <q-td></q-td>
                <q-td></q-td>
                <q-td>
                  <q-btn flat outline dense color="primary" label="Add Company"
                    style="background-color: #027be3; color:#ffffff !important;padding:4px;"
                    @click="showAddItemDialog('Add Company')"></q-btn>
                </q-td>
              </q-tr>
              <div class="q-pa-sm q-gutter-sm">
                <q-dialog v-model="companyDialog">
                  <q-card>
                    <q-companyDialog>
                      <q-avatar>
                        <q-icon name="business" />
                      </q-avatar>

                      <q-companyDialog-title><span class="text-weight-bold">{{ dialogHeaderText }}
                          !</span></q-companyDialog-title>

                      <q-btn style="float:right;" flat round dense icon="close" v-close-popup />
                    </q-companyDialog>

                    <q-card-section>
                      <div class="row">
                        <q-form @submit="onSubmit" @reset="onReset">
                          <q-input v-model="editedItem.name" label="Company Name" lazy-rules
                            :rules="[val => val && val.length > 0 || 'Please Enter Company Name']" maxlength="100">
                            <q-avatar>
                              <q-icon name="add_business" color="black" />
                            </q-avatar>
                          </q-input>
                          <q-input v-model="editedItem.website" label="Website" lazy-rules
                            :rules="[val => val && val.length > 0 || 'Please Enter Company Website']" maxlength="300">
                            <q-avatar>
                              <q-icon name="http" color="black" />
                            </q-avatar>
                          </q-input>
                          <q-input v-model="editedItem.registrationNumber" label="Registration Number" lazy-rules
                            :rules="[val => val && val.length > 0 || 'Please Enter Registration Number']" maxlength="200">
                            <q-avatar>
                              <q-icon name="app_registration" color="black" />
                            </q-avatar>
                          </q-input>
                          <q-input v-model="editedItem.vatNumber" label="VAT Number" lazy-rules
                            :rules="[val => val && val.length > 0 || 'Please Enter VAT Number']" maxlength="200">
                            <q-avatar>
                              <q-icon name="app_registration" color="black" />
                            </q-avatar>
                          </q-input>
                          <q-input v-model="editedItem.officeContactNumber" label="Office Contact Number" lazy-rules
                            :rules="[val => val && val.length > 0 || 'Please Enter Office Contact Number']"
                            maxlength="200">
                            <q-avatar>
                              <q-icon name="call" color="black" />
                            </q-avatar>
                          </q-input>
                          <q-input v-model="editedItem.secondaryContactNumber" label="Secondary Contact Number" lazy-rules
                            :rules="[val => val && val.length > 0 || 'Please Enter Secondary Contact Number']"
                            maxlength="200">
                            <q-avatar>
                              <q-icon name="call" color="black" />
                            </q-avatar>
                          </q-input>
                          <q-checkbox size="sm" v-model="editedItem.isActive" val="sm" label="Active">
                            <q-avatar>
                              <q-icon name="toggle_on" color="black" v-if="editedItem.isActive" />
                              <q-icon name="toggle_off" color="black" v-if="!editedItem.isActive" />
                            </q-avatar>
                          </q-checkbox>
                          <div style="float: right;">
                            <q-btn label="Save" type="submit" color="primary"
                              style="background-color: #027be3; color:#ffffff !important;" flat class="q-ml-xs">
                              <q-icon name="save" style="padding-left:5px;" />
                            </q-btn>
                            <q-btn label="Reset" type="reset" color="primary"
                              style="background-color: #027be3; color:#ffffff !important;" flat class="q-ml-xs">
                              <q-icon name="clear_all" />
                            </q-btn>
                          </div>
                        </q-form>
                      </div>
                    </q-card-section>
                  </q-card>
                </q-dialog>
              </div>

            </template>

            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="id" :props="props">
                  {{ props.row.id }}
                </q-td>
                <q-td key="name" :props="props">
                  {{ props.row.name }}
                  <!-- <q-popup-edit v-model="props.row.name" title="Update Name" buttons persistent>
                <q-input type="text" v-model="props.row.name" dense autofocus hint="Use this to update company name"></q-input>
              </q-popup-edit> -->
                </q-td>
                <q-td key="website" :props="props">
                  <div class="text-pre-wrap">{{ props.row.website }}</div>
                </q-td>
                <q-td key="registrationNumber" :props="props">
                  {{ props.row.registrationNumber }}
                </q-td>
                <q-td key="officeContactNumber" :props="props">
                  {{ props.row.officeContactNumber }}
                </q-td>
                <q-td key="secondaryContactNumber" :props="props">
                  {{ props.row.secondaryContactNumber }}
                </q-td>
                <q-td key="isActive" :props="props">{{ props.row.isActive }}
                </q-td>
                <q-td key="created" :props="props">{{ props.row.created | formatDate }}</q-td>
                <q-td key="createdBy" :props="props">{{ props.row.createdBy }}</q-td>
                <q-td key="lastModified" :props="props">{{ props.row.lastModified | formatDate }}</q-td>
                <q-td key="lastModifiedBy" :props="props">{{ props.row.lastModifiedBy }}</q-td>
                <q-td key="actions" :props="props">
                  <div style="float: right;">
                    <q-btn color="blue" label="update" @click="showEditItemDialog(props.row, 'Update Company')" size=sm>
                      <q-icon name="edit" /></q-btn>&nbsp;
                    <q-btn color="red" label="delete" @click="deleteItem(props.row)" size=sm> <q-icon
                        name="delete" /></q-btn>
                  </div>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
      </div>
    </q-page>
  </q-page-container>
</template>

<style lang="stylus">
  .q-form-container
    max-width 820px
    margin auto
</style>
