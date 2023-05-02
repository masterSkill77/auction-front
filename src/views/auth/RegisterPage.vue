<template>
  <div
    class="login-page register-page-wrap d-flex align-items-center flex-wrap justify-content-center"
  >
    <div class="container">
      <div class="row align-items-center">
        <div class="col-md-6 col-lg-7">
          <img src="vendors/images/register-page-img.png" alt="" />
        </div>
        <div class="col-md-6 col-lg">
          <div class="register-box -5 p-5 bg-white box-shadow border-radius-10">
            <div class="wizard-content">
              <form class="tab-wizard2 wizard-circle wizard">
                <h5>Basic Account Credentials</h5>
                <section>
                  <div class="form-wrap max-width-600 mx-auto">
                    <div class="form-group row">
                      <label class="col-sm-4 col-form-label"
                        >Email Address*</label
                      >
                      <div class="col-sm-8">
                        <input type="email" class="form-control" />
                      </div>
                    </div>
                    <div class="form-group row">
                      <label class="col-sm-4 col-form-label">Username*</label>
                      <div class="col-sm-8">
                        <input type="text" class="form-control" />
                      </div>
                    </div>
                    <div class="form-group row">
                      <label class="col-sm-4 col-form-label">Password*</label>
                      <div class="col-sm-8">
                        <input type="password" class="form-control" />
                      </div>
                    </div>
                    <div class="form-group row">
                      <label class="col-sm-4 col-form-label"
                        >Confirm Password*</label
                      >
                      <div class="col-sm-8">
                        <input type="password" class="form-control" />
                      </div>
                    </div>
                  </div>
                </section>
                <h5>Personal Information</h5>
                <section>
                  <div class="form-wrap max-width-600 mx-auto">
                    <div class="form-group row">
                      <label class="col-sm-4 col-form-label">Full Name*</label>
                      <div class="col-sm-8">
                        <input type="text" class="form-control" />
                      </div>
                    </div>
                    <div class="form-group row align-items-center">
                      <label class="col-sm-4 col-form-label">Gender*</label>
                      <div class="col-sm-8">
                        <div
                          class="custom-control custom-radio custom-control-inline pb-0"
                        >
                          <input
                            type="radio"
                            id="male"
                            name="gender"
                            class="custom-control-input"
                          />
                          <label class="custom-control-label" for="male"
                            >Male</label
                          >
                        </div>
                        <div
                          class="custom-control custom-radio custom-control-inline pb-0"
                        >
                          <input
                            type="radio"
                            id="female"
                            name="gender"
                            class="custom-control-input"
                          />
                          <label class="custom-control-label" for="female"
                            >Female</label
                          >
                        </div>
                      </div>
                    </div>
                    <div class="form-group row">
                      <label class="col-sm-4 col-form-label">City</label>
                      <div class="col-sm-8">
                        <input type="text" class="form-control" />
                      </div>
                    </div>
                    <div class="form-group row">
                      <label class="col-sm-4 col-form-label">State</label>
                      <div class="col-sm-8">
                        <input type="text" class="form-control" />
                      </div>
                    </div>
                  </div>
                </section>
              </form>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        id="success-modal-btn"
        hidden
        data-toggle="modal"
        data-target="#success-modal"
        data-backdrop="static"
      >
        Launch modal
      </button>
      <div
        class="modal fade"
        id="success-modal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div
          class="modal-dialog modal-dialog-centered max-width-400"
          role="document"
        >
          <div class="modal-content">
            <div class="modal-body text-center font-18">
              <h3 class="mb-20">Form Submitted!</h3>
              <div class="mb-30 text-center">
                <img src="vendors/images/success.png" />
              </div>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
              eiusmod
            </div>
            <div class="modal-footer justify-content-center">
              <a href="login.html" class="btn btn-primary">Done</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>
<style scoped>
.wizard-content .wizard > .steps > ul > li:after,
.wizard-content .wizard > .steps > ul > li:before {
  content: "" !important;
  z-index: 9 !important;
  display: block !important;
  position: absolute !important;
}

.wizard-content .wizard {
  width: 100% !important;
  overflow: hidden !important;
}

.wizard-content .wizard .content {
  margin-left: 0 !important;
}

.wizard-content .wizard > .steps {
  position: relative !important;
  display: block !important;
  width: 100% !important;
}

.wizard-content .wizard > .steps .current-info {
  position: absolute !important;
  left: -99999px !important;
}

.wizard-content .wizard > .steps > ul {
  display: table !important;
  width: 100% !important;
  table-layout: fixed !important;
  margin: 0 !important;
  padding: 0 !important;
  list-style: none !important;
}

.wizard-content .wizard > .steps > ul > li {
  display: table-cell !important;
  width: auto !important;
  vertical-align: top !important;
  text-align: center !important;
  position: relative !important;
}

.wizard-content .wizard > .steps > ul > li a {
  position: relative !important;
  padding-top: 52px !important;
  margin-top: 20px !important;
  margin-bottom: 20px !important;
  display: block !important;
}

.wizard-content .wizard > .steps > ul > li:before {
  left: 0 !important;
}

.wizard-content .wizard > .steps > ul > li:after {
  right: 0 !important;
}

.wizard-content .wizard > .steps > ul > li:first-child:before,
.wizard-content .wizard > .steps > ul > li:last-child:after {
  content: none !important;
}

.wizard-content .wizard > .steps > ul > li.current > a {
  color: #2f3d4a !important;
  cursor: default !important;
}

.wizard-content .wizard > .steps > ul > li.current .step {
  border-color: #009efb !important;
  background-color: #fff !important;
  color: #009efb !important;
}

.wizard-content .wizard > .steps > ul > li.disabled a,
.wizard-content .wizard > .steps > ul > li.disabled a:focus,
.wizard-content .wizard > .steps > ul > li.disabled a:hover {
  color: #999 !important;
  cursor: default !important;
}

.wizard-content .wizard > .steps > ul > li.done a,
.wizard-content .wizard > .steps > ul > li.done a:focus,
.wizard-content .wizard > .steps > ul > li.done a:hover {
  color: #999 !important;
}

.wizard-content .wizard > .steps > ul > li.done .step {
  background-color: #009efb !important;
  border-color: #009efb !important;
  color: #fff !important;
}

.wizard-content .wizard > .steps > ul > li.error .step {
  border-color: #f62d51 !important;
  color: #f62d51 !important;
}

.wizard-content .wizard > .steps .step {
  background-color: #fff !important;
  display: inline-block !important;
  position: absolute !important;
  top: 0 !important;
  left: 50% !important;
  margin-left: -24px !important;
  z-index: 10 !important;
  text-align: center !important;
}

.wizard-content .wizard > .content {
  overflow: hidden !important;
  position: relative !important;
  width: auto !important;
  padding: 0 !important;
  margin: 0 !important;
}

.wizard-content .wizard > .content > .title {
  position: absolute !important;
  left: -99999px !important;
}

.wizard-content .wizard > .content > .body {
  padding: 0 10px !important;
}

.wizard-content .wizard > .content > iframe {
  border: 0 !important;
  width: 100% !important;
  height: 100% !important;
}

.wizard-content .wizard > .actions {
  position: relative !important;
  display: block !important;
  text-align: right !important;
  padding: 0 10px 20px !important;
}

.wizard-content .wizard > .actions > ul {
  float: right !important;
  list-style: none !important;
  padding: 0 !important;
  margin: 0 !important;
}

.wizard-content .wizard > .actions > ul:after {
  content: "" !important;
  display: table !important;
  clear: both !important;
}

.wizard-content .wizard > .actions > ul > li {
  float: left !important;
}

.wizard-content .wizard > .actions > ul > li + li {
  margin-left: 10px !important;
}

.wizard-content .wizard > .actions > ul > li > a {
  background: #009efb !important;
  color: #fff !important;
  display: block !important;
  padding: 7px 12px !important;
  border-radius: 4px !important;
  border: 1px solid transparent !important;
  min-width: 100px !important;
  text-align: center !important;
}

.wizard-content .wizard > .actions > ul > li > a:focus,
.wizard-content .wizard > .actions > ul > li > a:hover {
  -webkit-box-shadow: 0 0 0 100px rgba(0, 0, 0, 0.05) inset !important;
  box-shadow: 0 0 0 100px rgba(0, 0, 0, 0.05) inset !important;
}

.wizard-content .wizard > .actions > ul > li > a:active {
  -webkit-box-shadow: 0 0 0 100px rgba(0, 0, 0, 0.1) inset !important;
  box-shadow: 0 0 0 100px rgba(0, 0, 0, 0.1) inset !important;
}

.wizard-content .wizard > .actions > ul > li > a[href="#previous"] {
  background-color: #fff !important;
  color: #009efb !important;
  border: 1px solid #009efb !important;
}

.wizard-content .wizard > .actions > ul > li > a[href="#previous"]:focus,
.wizard-content .wizard > .actions > ul > li > a[href="#previous"]:hover {
  -webkit-box-shadow: 0 0 0 100px rgba(0, 0, 0, 0.02) inset !important;
  box-shadow: 0 0 0 100px rgba(0, 0, 0, 0.02) inset !important;
}

.wizard-content .wizard > .actions > ul > li > a[href="#previous"]:active {
  -webkit-box-shadow: 0 0 0 100px rgba(0, 0, 0, 0.04) inset !important;
  box-shadow: 0 0 0 100px rgba(0, 0, 0, 0.04) inset !important;
}

.wizard-content .wizard > .actions > ul > li.disabled > a,
.wizard-content .wizard > .actions > ul > li.disabled > a:focus,
.wizard-content .wizard > .actions > ul > li.disabled > a:hover {
  color: #999 !important;
}

.wizard-content .wizard > .actions > ul > li.disabled > a[href="#previous"],
.wizard-content
  .wizard
  > .actions
  > ul
  > li.disabled
  > a[href="#previous"]:focus,
.wizard-content
  .wizard
  > .actions
  > ul
  > li.disabled
  > a[href="#previous"]:hover {
  -webkit-box-shadow: none !important;
  box-shadow: none !important;
}

.wizard-content .wizard.wizard-circle > .steps > ul > li:after,
.wizard-content .wizard.wizard-circle > .steps > ul > li:before {
  top: 45px !important;
  width: 50% !important;
  height: 3px !important;
  background-color: #009efb !important;
}

.wizard-content .wizard.wizard-circle > .steps > ul > li.current:after,
.wizard-content .wizard.wizard-circle > .steps > ul > li.current ~ li:after,
.wizard-content .wizard.wizard-circle > .steps > ul > li.current ~ li:before {
  background-color: #f3f3f3 !important;
}

.wizard-content .wizard.wizard-circle > .steps .step {
  width: 50px !important;
  height: 50px !important;
  line-height: 45px !important;
  border: 3px solid #f3f3f3 !important;
  font-size: 1.3rem !important;
  border-radius: 50% !important;
}

.wizard-content .wizard.wizard-notification > .steps > ul > li:after,
.wizard-content .wizard.wizard-notification > .steps > ul > li:before {
  top: 39px !important;
  width: 50% !important;
  height: 2px !important;
  background-color: #009efb !important;
}

.wizard-content .wizard.wizard-notification > .steps > ul > li.current .step {
  border: 2px solid #009efb !important;
  color: #009efb !important;
  line-height: 36px !important;
}

.wizard-content
  .wizard.wizard-notification
  > .steps
  > ul
  > li.current
  .step:after,
.wizard-content
  .wizard.wizard-notification
  > .steps
  > ul
  > li.done
  .step:after {
  border-top-color: #009efb !important;
}

.wizard-content .wizard.wizard-notification > .steps > ul > li.current:after,
.wizard-content
  .wizard.wizard-notification
  > .steps
  > ul
  > li.current
  ~ li:after,
.wizard-content
  .wizard.wizard-notification
  > .steps
  > ul
  > li.current
  ~ li:before {
  background-color: #f3f3f3 !important;
}

.wizard-content .wizard.wizard-notification > .steps > ul > li.done .step {
  color: #fff !important;
}

.wizard-content .wizard.wizard-notification > .steps .step {
  width: 40px !important;
  height: 40px !important;
  line-height: 40px !important;
  font-size: 1.3rem !important;
  border-radius: 15% !important;
  background-color: #f3f3f3 !important;
}

.wizard-content .wizard.wizard-notification > .steps .step:after {
  content: "" !important;
  width: 0 !important;
  height: 0 !important;
  position: absolute !important;
  bottom: 0 !important;
  left: 50% !important;
  margin-left: -8px !important;
  margin-bottom: -8px !important;
  border-left: 7px solid transparent !important;
  border-right: 7px solid transparent !important;
  border-top: 8px solid #f3f3f3 !important;
}

.wizard-content .wizard.vertical > .steps {
  display: inline !important;
  float: left !important;
  width: 20% !important;
}

.wizard-content .wizard.vertical > .steps > ul > li {
  display: block !important;
  width: 100% !important;
}

.wizard-content .wizard.vertical > .steps > ul > li.current:after,
.wizard-content .wizard.vertical > .steps > ul > li.current:before,
.wizard-content .wizard.vertical > .steps > ul > li.current ~ li:after,
.wizard-content .wizard.vertical > .steps > ul > li.current ~ li:before,
.wizard-content .wizard.vertical > .steps > ul > li:after,
.wizard-content .wizard.vertical > .steps > ul > li:before {
  background-color: transparent !important;
}

@media (max-width: 768px) {
  .wizard-content .wizard > .steps > ul {
    margin-bottom: 20px !important;
  }
  .wizard-content .wizard > .steps > ul > li {
    display: block !important;
    float: left !important;
    width: 50% !important;
  }
  .wizard-content .wizard > .steps > ul > li > a {
    margin-bottom: 0 !important;
  }
  .wizard-content .wizard > .steps > ul > li:first-child:before {
    content: "" !important;
  }
  .wizard-content .wizard > .steps > ul > li:last-child:after {
    content: "" !important;
    background-color: #009efb !important;
  }
  .wizard-content .wizard.vertical > .steps {
    width: 15% !important;
  }
}

@media (max-width: 480px) {
  .wizard-content .wizard > .steps > ul > li {
    width: 50% !important;
  }
  .wizard-content .wizard > .steps > ul > li.current:after {
    background-color: #009efb !important;
  }
  .wizard-content .wizard.vertical > .steps > ul > li {
    display: block !important;
    float: left !important;
    width: 50% !important;
  }
  .wizard-content .wizard.vertical > .steps {
    width: 100% !important;
    float: none !important;
  }
}
</style>
