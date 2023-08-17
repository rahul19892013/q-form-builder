<!-- eslint-disable space-before-function-paren -->
<!-- eslint-disable semi -->
<!-- eslint-disable semi -->
<script>
import axios from 'axios'

import APISettings from '../../config/ApiSettings'
import { getRequest, putRequest } from '../../services/api.services';
import { errorNotification, successNotification } from '../../utilities/useShowNotification';

export default {
  name: 'Users',
  components: {},
  data: function () {
    return {
      filter: '',
      dialogHeaderText: null,
      userDialog: false,
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
          name: 'userName',
          required: true,
          label: 'User Name',
          align: 'left',
          field: row => row.userName,
          format: val => `${val}`,
          sortable: true
        },
        { name: 'role', align: 'left', label: 'Role', field: 'role', sortable: true },
        {
          name: 'firstName',
          label: 'First Name',
          align: 'left',
          field: 'firstName',
          sortable: true
        },
        { name: 'lastName', align: 'left', label: 'Last Name', field: 'lastName', sortable: true },
        // { name: 'emailAddress', align: 'left', label: 'Email Address', field: 'emailAddress', sortable: true },
        // { name: 'mobileNumber', align: 'left', label: 'Mobile Number', field: 'mobileNumber', sortable: true },
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
    onSubmit() {
      if (this.editedIndex > -1 && this.editedItem.id > 0) {
        this.updateCompany(this.editedItem)
      } else {
        this.addCompany(this.editedItem);
      }
    },
    getCompanies() {
      getRequest('Users/GetUsers')
        .then((response) => {
          this.data = response
        });
    },
    updateCompany(company) {
      putRequest('User/UpdateCompany', {
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
      axios.post(APISettings.baseURL + 'User/AddCompany', { company: { name: company.name, website: company.website, registrationNumber: company.registrationNumber, vatNumber: company.vatNumber, officeContactNumber: company.officeContactNumber, secondaryContactNumber: company.secondaryContactNumber, isActive: company.isActive } },
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
            this.userDialog = true;
          }
        }).catch(e => {
          errorNotification(e)
        })
    },
    deleteCompany(company) {
      axios.delete(APISettings.baseURL + 'User/DeleteCompany',
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
      this.userDialog = true;
    },
    close() {
      this.userDialog = false
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
          <q-table title="Users" :data="data" :columns="columns" :filter="filter" row-key="id" binary-state-sort>
            <template v-slot:top-right>
              <q-tr>
                <q-td>
                  <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
                    <template v-slot:append>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </q-td>
                <!-- <q-td></q-td>
                <q-td></q-td>
                <q-td></q-td>
                <q-td>
                  <q-btn flat outline dense color="primary" label="Add User"
                    style="background-color: #027be3; color:#ffffff !important;padding:4px;"
                    @click="showAddItemDialog('Add User')"></q-btn>
                </q-td> -->
              </q-tr>
              <div class="q-pa-sm q-gutter-sm">
                <q-dialog v-model="userDialog">
                  <q-card>
                    <q-userDialog>
                      <q-avatar>
                        <q-icon name="person" />
                      </q-avatar>

                      <q-userDialog-title><span class="text-weight-bold">{{ dialogHeaderText }}
                          !</span></q-userDialog-title>

                      <q-btn style="float:right;" flat round dense icon="close" v-close-popup />
                    </q-userDialog>

                    <q-card-section>
                      <div class="row">
                        <q-form @submit="onSubmit" @reset="onReset">
                          <q-input v-model="editedItem.userName" label="User Name" lazy-rules
                            :rules="[val => val && val.length > 0 || 'Please Enter User Name']" maxlength="100">
                            <q-avatar>
                              <q-icon name="person" color="black" />
                            </q-avatar>
                          </q-input>
                          <q-input v-model="editedItem.firstName" label="First Name" lazy-rules
                            :rules="[val => val && val.length > 0 || 'Please Enter First Name']" maxlength="300">
                            <q-avatar>
                              <q-icon name="person" color="black" />
                            </q-avatar>
                          </q-input>
                          <q-input v-model="editedItem.lastName" label="Last Name" lazy-rules
                            :rules="[val => val && val.length > 0 || 'Please Enter Last Name']" maxlength="200">
                            <q-avatar>
                              <q-icon name="person" color="black" />
                            </q-avatar>
                          </q-input>
                          <q-input v-model="editedItem.emailAddress" label="Email Address" lazy-rules
                            :rules="[val => val && val.length > 0 || 'Please Enter Email Address']" maxlength="200">
                            <q-avatar>
                              <q-icon name="email" color="black" />
                            </q-avatar>
                          </q-input>
                          <q-input v-model="editedItem.mobileNumber" label="Mobile Number" lazy-rules
                            :rules="[val => val && val.length > 0 || 'Please Enter Mobile Number']"
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
                <q-td key="userName" :props="props">
                  {{ props.row.userName }}
                  <!-- <q-popup-edit v-model="props.row.name" title="Update Name" buttons persistent>
                <q-input type="text" v-model="props.row.name" dense autofocus hint="Use this to update company name"></q-input>
              </q-popup-edit> -->
                </q-td>
                <q-td key="role" :props="props">
                  <div class="text-pre-wrap">{{ props.row.roleName }}</div>
                </q-td>
                <q-td key="firstName" :props="props">
                  {{ props.row.firstName }}
                </q-td>
                <q-td key="lastName" :props="props">
                  {{ props.row.lastName }}
                </q-td>
                <q-td key="isActive" :props="props">{{ props.row.isActive }}
                </q-td>
                <q-td key="created" :props="props">{{ props.row.created | formatDate }}</q-td>
                <q-td key="createdBy" :props="props">{{ props.row.createdBy }}</q-td>
                <q-td key="lastModified" :props="props">{{ props.row.lastModified | formatDate }}</q-td>
                <q-td key="lastModifiedBy" :props="props">{{ props.row.lastModifiedBy }}</q-td>
                <q-td key="actions" :props="props">
                  <div style="float: right;">
                    <q-btn color="blue" label="update" @click="showEditItemDialog(props.row, 'Update User')" size=sm>
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
