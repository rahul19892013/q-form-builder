<!-- eslint-disable space-before-function-paren -->
<!-- eslint-disable semi -->
<!-- eslint-disable semi -->
<script>
import axios from 'axios'

import APISettings from '../../config/ApiSettings'
import { errorNotification, successNotification } from '../../utilities/useShowNotification';

export default {
  name: 'Categories',
  components: {},
  data: function () {
    return {
      filter: '',
      dialogHeaderText: null,
      categoryDialog: false,
      editedIndex: -1,
      editedItem: {
        id: 0,
        name: '',
        description: '',
        imagePath: '',
        isActive: false
      },
      defaultItem: {
        id: 0,
        name: '',
        description: '',
        imagePath: '',
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
          name: 'description',
          label: 'Description',
          align: 'left',
          field: 'description',
          sortable: true,
          style: 'width: 50px'
        },
        // { name: 'imagePath', align: 'left', label: 'Image Path', field: 'imagePath' },
        { name: 'isActive', align: 'left', label: 'Active', field: 'isActive', sortable: true },
        { name: 'created', align: 'left', label: 'Created', field: 'created', sortable: true },
        { name: 'lastModified', align: 'left', label: 'Modified', field: 'lastModified', sortable: true },
        { name: 'actions', label: 'Actions', feld: 'actions', align: 'center' }
      ],
      data: [{}]
    }
  },
  mounted() {
    this.getCategories()
  },
  methods: {
    showAddItemDialog(text) {
      this.editedItem = Object.assign({}, this.defaultItem)
      this.dialogHeaderText = text
      this.categoryDialog = true
    },
    onSubmit() {
      if (this.editedIndex > -1 && this.editedItem.id > 0) {
        this.updateCategory(this.editedItem)
      } else {
        this.addCategory(this.editedItem);
      }
    },
    getCategories() {
      axios.get(APISettings.baseURL + 'Category/GetCategories',
        {
          headers: APISettings.getHeaders()[0]
          //  ,params: APISettings.axiosParams(3, 7)
        }).then(res => {
          this.data = res.data.data.records
        }).catch(e => {
          this.showError(e)
        })
    },
    updateCategory(category) {
      axios.put(APISettings.baseURL + 'Category/UpdateCategory', { category: { id: category.id, name: category.name, description: category.description, imagePath: category.imagePath, isActive: category.isActive } },
        {
          headers: APISettings.getHeaders()[0]
        }).then(res => {
          if (res.data.data) {
            successNotification(res.data.message);
            this.updateAddedOrEditedItem(res.data.data);
            Object.assign(this.data[this.editedIndex], this.editedItem);
            this.close();
          } else {
            errorNotification(res.data.message);
            this.categoryDialog = true;
          }
        }).catch(e => {
          errorNotification(e)
        })
    },
    addCategory(category) {
      axios.post(APISettings.baseURL + 'Category/AddCategory', { category: { name: category.name, description: category.description, imagePath: category.imagePath, isActive: category.isActive } },
        {
          headers: APISettings.getHeaders()[0]
        }).then(res => {
          if (res.data.data) {
            successNotification(res.data.message);
            this.updateAddedOrEditedItem(res.data.data);
            this.data.push(this.editedItem);
            this.close();
          } else {
            errorNotification(res.data.message);
            this.categoryDialog = true;
          }
        }).catch(e => {
          errorNotification(e)
        })
    },
    deleteCategory(category) {
      axios.delete(APISettings.baseURL + 'Category/DeleteCategory',
        {
          headers: APISettings.getHeaders()[0],
          data: { category: { id: category.id } }
        }).then(res => {
          if (res.data.success) {
            successNotification(res.data.message);
          } else {
            errorNotification(res.data.message);
          }
        }).catch(e => {
          errorNotification(e)
        })
    },
    deleteItem(item) {
      const index = this.data.indexOf(item);
      const text = 'Are you sure you want to delete this item?';
      if (confirm(text)) {
        this.deleteCategory(item);
        this.data.splice(index, 1);
      }
    },
    showEditItemDialog(item, text) {
      this.editedIndex = this.data.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogHeaderText = text;
      this.categoryDialog = true;
    },
    close() {
      this.categoryDialog = false
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
          <q-table title="Categories" :data="data" :columns="columns" :filter="filter" row-key="id" binary-state-sort>
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
                  <q-btn flat outline dense color="primary" label="Add Category"
                    style="background-color: #027be3; color:#ffffff !important;padding:4px;"
                    @click="showAddItemDialog('Add Category')"></q-btn>
                </q-td>
              </q-tr>
              <div class="q-pa-sm q-gutter-sm">
                <q-dialog v-model="categoryDialog">
                  <q-card>
                    <q-categoryDialog>
                      <q-avatar>
                        <q-icon name="category" />
                      </q-avatar>

                      <q-categoryDialog-title><span class="text-weight-bold">{{ dialogHeaderText }}
                          !</span></q-categoryDialog-title>

                      <q-btn style="float:right;" flat round dense icon="close" v-close-popup />
                    </q-categoryDialog>

                    <q-card-section>
                      <div class="row">
                        <q-form @submit="onSubmit" @reset="onReset">
                          <q-input v-model="editedItem.name" label="Category Name" lazy-rules
                            :rules="[val => val && val.length > 0 || 'Please Enter Category Name']" maxlength="100">
                            <q-avatar>
                              <q-icon name="category" color="black" />
                            </q-avatar>
                          </q-input>
                          <q-input v-model="editedItem.description" label="Description" lazy-rules
                            :rules="[val => val && val.length > 0 || 'Please Enter Action Description']" maxlength="300">
                            <q-avatar>
                              <q-icon name="description" color="black" />
                            </q-avatar>
                          </q-input>
                          <q-input v-model="editedItem.imagePath" label="Image Path" lazy-rules
                            :rules="[val => val && val.length > 0 || 'Please Enter category Image Path']" maxlength="200">
                            <q-avatar>
                              <q-icon name="http" color="black" />
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
                <q-input type="text" v-model="props.row.name" dense autofocus hint="Use this to update category name"></q-input>
              </q-popup-edit> -->
                </q-td>
                <q-td key="description" :props="props">
                  <div class="text-pre-wrap">{{ props.row.description }}</div>
                </q-td>
                <q-td key="imagePath" :props="props">
                  {{ props.row.imagePath }}
                </q-td>
                <q-td key="isActive" :props="props">{{ props.row.isActive }}
                </q-td>
                <q-td key="created" :props="props">{{ props.row.created | formatDate }}</q-td>
                <q-td key="createdBy" :props="props">{{ props.row.createdBy }}</q-td>
                <q-td key="lastModified" :props="props">{{ props.row.lastModified | formatDate }}</q-td>
                <q-td key="lastModifiedBy" :props="props">{{ props.row.lastModifiedBy }}</q-td>
                <q-td key="actions" :props="props">
                  <div style="float: right;">
                    <q-btn color="blue" label="update" @click="showEditItemDialog(props.row, 'Update Category')" size=sm>
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
