<template>
  <div class="blog-area section-padding-100">
    <div class="container">
      <div>
        <h2 class="text-center">Login</h2>
        <div class="form-group">
          <label for="exampleInputEmail1">Email address</label>
          <input
            type="email"
            class="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="Enter email"
            v-model="email"
          />
          <small id="emailHelp" class="form-text text-muted"
            >We'll never share your email with anyone else.</small
          >
        </div>
        <div class="form-group">
          <label for="exampleInputPassword1">Password</label>
          <input
            type="password"
            class="form-control"
            id="exampleInputPassword1"
            placeholder="Password"
            v-model="password"
          />
        </div>
        <div class="form-check">
          <input type="checkbox" class="form-check-input" id="exampleCheck1" />
          <label class="form-check-label" for="exampleCheck1"
            >Check me out</label
          >
        </div>
        <button @click="login" class="btn btn-primary">Submit</button>
      </div>
    </div>
  </div>
</template>
<script>
import AuthService from "@/services/AuthService";
export default {
  data() {
    return {
      email: "",
      password: "",
      authService: null,
    };
  },
  methods: {
    login() {
      this.authService.login()
      console.log({ email: this.email, password: this.password });
    },
  },
  mounted() {
    this.authService = new AuthService();
  },
};
</script>
