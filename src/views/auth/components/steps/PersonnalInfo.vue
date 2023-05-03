<template>
  <section
    id="steps-uid-0-p-1"
    role="tabpanel"
    aria-labelledby="steps-uid-0-h-1"
    class="body"
    aria-hidden="true"
  >
    <div class="form-wrap max-width-600 mx-auto">
      <div class="form-group row">
        <label class="col-sm-4 col-form-label">First Name*</label>
        <div :class="{ error: v$.firstName.$errors.length, 'col-sm-8': true }">
          <input v-model="firstName" type="text" class="form-control" />
          <div
            class="input-errors"
            v-for="error of v$.firstName.$errors"
            :key="error.$uid"
          >
            <div class="error-msg">{{ error.$message }}</div>
          </div>
        </div>
      </div>
      <div class="form-group row">
        <label class="col-sm-4 col-form-label">Last Name*</label>
        <div class="col-sm-8">
          <input type="text" class="form-control" />
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { useVuelidate } from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
export default {
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      firstName: "",
      lastName: "",
      contact: {
        email: "",
      },
    };
  },
  validations() {
    return {
      firstName: { required }, // Matches this.firstName
      lastName: { required }, // Matches this.lastName
      contact: {
        email: { required, email }, // Matches this.contact.email
      },
    };
  },
};
</script>
