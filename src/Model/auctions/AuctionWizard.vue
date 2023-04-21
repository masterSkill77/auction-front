<template>
  <div class="pd-ltr-20 xs-pd-20-10">
    <div class="min-height-200px">
      <div class="page-header">
        <div class="row">
          <div class="col-md-6 col-sm-12">
            <div class="title">
              <h4>Form Wizards</h4>
            </div>
            <nav aria-label="breadcrumb" role="navigation">
              <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="index.html">Home</a></li>
                <li class="breadcrumb-item active" aria-current="page">
                  Form Wizards
                </li>
              </ol>
            </nav>
          </div>
          <div class="col-md-6 col-sm-12 text-right">
            <div class="dropdown">
              <a
                class="btn btn-primary dropdown-toggle"
                href="#"
                role="button"
                data-toggle="dropdown"
              >
                January 2018
              </a>
              <div class="dropdown-menu dropdown-menu-right">
                <a class="dropdown-item" href="#">Export List</a>
                <a class="dropdown-item" href="#">Policies</a>
                <a class="dropdown-item" href="#">View Assets</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="pd-20 card-box mb-30">
        <div class="clearfix">
          <h4 class="text-blue h4">Step wizard</h4>
          <p class="mb-30">jQuery Step wizard</p>
        </div>
        <div class="wizard-content">
          <form
            class="tab-wizard wizard-circle wizard clearfix"
            role="application"
            id="steps-uid-0"
          >
            <div class="steps clearfix">
              <ul role="tablist">
                <li
                  role="tab"
                  class="first current"
                  aria-disabled="false"
                  aria-selected="true"
                >
                  <a
                    id="steps-uid-0-t-0"
                    href="#steps-uid-0-h-0"
                    aria-controls="steps-uid-0-p-0"
                    ><span class="current-info audible">current step: </span
                    ><span class="step">1</span> Personal Info</a
                  >
                </li>
                <li role="tab" class="disabled" aria-disabled="true">
                  <a
                    id="steps-uid-0-t-1"
                    href="#steps-uid-0-h-1"
                    aria-controls="steps-uid-0-p-1"
                    ><span class="step">2</span> Job Status</a
                  >
                </li>
                <li role="tab" class="disabled" aria-disabled="true">
                  <a
                    id="steps-uid-0-t-2"
                    href="#steps-uid-0-h-2"
                    aria-controls="steps-uid-0-p-2"
                    ><span class="step">3</span> Interview</a
                  >
                </li>
                <li role="tab" class="disabled last" aria-disabled="true">
                  <a
                    id="steps-uid-0-t-3"
                    href="#steps-uid-0-h-3"
                    aria-controls="steps-uid-0-p-3"
                    ><span class="step">4</span> Remark</a
                  >
                </li>
              </ul>
            </div>
            <div class="content clearfix">
              <h5 id="steps-uid-0-h-0" tabindex="-1" class="title current">
                Personal Info
              </h5>
              <section
                id="steps-uid-0-p-0"
                role="tabpanel"
                aria-labelledby="steps-uid-0-h-0"
                class="body current"
                aria-hidden="false"
              >
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label>First Name :</label>
                      <input type="text" class="form-control" />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label>Last Name :</label>
                      <input type="text" class="form-control" />
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label>Email Address :</label>
                      <input type="email" class="form-control" />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label>Phone Number :</label>
                      <input type="text" class="form-control" />
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label>Select City :</label>
                      <select class="custom-select form-control">
                        <option value="">Select City</option>
                        <option value="Amsterdam">India</option>
                        <option value="Berlin">UK</option>
                        <option value="Frankfurt">US</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label>Date of Birth :</label>
                      <input
                        type="text"
                        class="form-control date-picker"
                        placeholder="Select Date"
                      />
                    </div>
                  </div>
                </div>
              </section>
              <!-- Step 2 -->
              <h5 id="steps-uid-0-h-1" tabindex="-1" class="title">
                Job Status
              </h5>
              <section
                id="steps-uid-0-p-1"
                role="tabpanel"
                aria-labelledby="steps-uid-0-h-1"
                class="body"
                aria-hidden="true"
                style="display: none"
              >
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label>Job Title :</label>
                      <input type="text" class="form-control" />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label>Company Name :</label>
                      <input type="text" class="form-control" />
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div class="form-group">
                      <label>Job Description :</label>
                      <textarea class="form-control"></textarea>
                    </div>
                  </div>
                </div>
              </section>
              <!-- Step 3 -->
              <h5 id="steps-uid-0-h-2" tabindex="-1" class="title">
                Interview
              </h5>
              <section
                id="steps-uid-0-p-2"
                role="tabpanel"
                aria-labelledby="steps-uid-0-h-2"
                class="body"
                aria-hidden="true"
                style="display: none"
              >
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label>Interview For :</label>
                      <input type="text" class="form-control" />
                    </div>
                    <div class="form-group">
                      <label>Interview Type :</label>
                      <select class="form-control">
                        <option>Normal</option>
                        <option>Difficult</option>
                        <option>Hard</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label>Interview Date :</label>
                      <input
                        type="text"
                        class="form-control date-picker"
                        placeholder="Select Date"
                      />
                    </div>
                    <div class="form-group">
                      <label>Interview Time :</label>
                      <input
                        class="form-control time-picker td-input"
                        placeholder="Select time"
                        type="text"
                        readonly=""
                      />
                    </div>
                  </div>
                </div>
              </section>
              <!-- Step 4 -->
              <h5 id="steps-uid-0-h-3" tabindex="-1" class="title">Remark</h5>
              <section
                id="steps-uid-0-p-3"
                role="tabpanel"
                aria-labelledby="steps-uid-0-h-3"
                class="body"
                aria-hidden="true"
                style="display: none"
              >
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label>Behaviour :</label>
                      <input type="text" class="form-control" />
                    </div>
                    <div class="form-group">
                      <label>Confidance</label>
                      <input type="text" class="form-control" />
                    </div>
                    <div class="form-group">
                      <label>Result</label>
                      <select class="form-control">
                        <option>Select Result</option>
                        <option>Selected</option>
                        <option>Rejected</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label>Comments</label>
                      <textarea class="form-control"></textarea>
                    </div>
                  </div>
                </div>
              </section>
            </div>
            <div class="actions clearfix">
              <ul role="menu" aria-label="Pagination">
                <li class="disabled" aria-disabled="true">
                  <a href="#previous" role="menuitem">Previous</a>
                </li>
                <li aria-hidden="false" aria-disabled="false">
                  <a href="#next" role="menuitem">Next</a>
                </li>
                <li aria-hidden="true" style="display: none">
                  <a href="#finish" role="menuitem">Submit</a>
                </li>
              </ul>
            </div>
          </form>
        </div>
      </div>

      <div class="pd-20 card-box mb-30">
        <div class="clearfix">
          <h4 class="text-blue h4">Step wizard vertical</h4>
          <p class="mb-30">jQuery Step wizard</p>
        </div>
        <div class="wizard-content">
          <form
            class="tab-wizard wizard-circle wizard vertical clearfix"
            role="application"
            id="steps-uid-1"
          >
            <div class="steps clearfix">
              <ul role="tablist">
                <li
                  role="tab"
                  class="first current"
                  aria-disabled="false"
                  aria-selected="true"
                >
                  <a
                    id="steps-uid-1-t-0"
                    href="#steps-uid-1-h-0"
                    aria-controls="steps-uid-1-p-0"
                    ><span class="current-info audible">current step: </span
                    ><span class="step">1</span> Personal Info</a
                  >
                </li>
                <li role="tab" class="disabled" aria-disabled="true">
                  <a
                    id="steps-uid-1-t-1"
                    href="#steps-uid-1-h-1"
                    aria-controls="steps-uid-1-p-1"
                    ><span class="step">2</span> Job Status</a
                  >
                </li>
                <li role="tab" class="disabled" aria-disabled="true">
                  <a
                    id="steps-uid-1-t-2"
                    href="#steps-uid-1-h-2"
                    aria-controls="steps-uid-1-p-2"
                    ><span class="step">3</span> Interview</a
                  >
                </li>
                <li role="tab" class="disabled last" aria-disabled="true">
                  <a
                    id="steps-uid-1-t-3"
                    href="#steps-uid-1-h-3"
                    aria-controls="steps-uid-1-p-3"
                    ><span class="step">4</span> Remark</a
                  >
                </li>
              </ul>
            </div>
            <div class="content clearfix">
              <h5 id="steps-uid-1-h-0" tabindex="-1" class="title current">
                Personal Info
              </h5>
              <section
                id="steps-uid-1-p-0"
                role="tabpanel"
                aria-labelledby="steps-uid-1-h-0"
                class="body current"
                aria-hidden="false"
              >
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label>First Name :</label>
                      <input type="text" class="form-control" />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label>Last Name :</label>
                      <input type="text" class="form-control" />
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label>Email Address :</label>
                      <input type="email" class="form-control" />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label>Phone Number :</label>
                      <input type="text" class="form-control" />
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label>Select City :</label>
                      <select class="custom-select form-control">
                        <option value="">Select City</option>
                        <option value="Amsterdam">India</option>
                        <option value="Berlin">UK</option>
                        <option value="Frankfurt">US</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label>Date of Birth :</label>
                      <input
                        type="text"
                        class="form-control date-picker"
                        placeholder="Select Date"
                      />
                    </div>
                  </div>
                </div>
              </section>
              <!-- Step 2 -->
              <h5 id="steps-uid-1-h-1" tabindex="-1" class="title">
                Job Status
              </h5>
              <section
                id="steps-uid-1-p-1"
                role="tabpanel"
                aria-labelledby="steps-uid-1-h-1"
                class="body"
                aria-hidden="true"
                style="display: none"
              >
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label>Job Title :</label>
                      <input type="text" class="form-control" />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label>Company Name :</label>
                      <input type="text" class="form-control" />
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div class="form-group">
                      <label>Job Description :</label>
                      <textarea class="form-control"></textarea>
                    </div>
                  </div>
                </div>
              </section>
              <!-- Step 3 -->
              <h5 id="steps-uid-1-h-2" tabindex="-1" class="title">
                Interview
              </h5>
              <section
                id="steps-uid-1-p-2"
                role="tabpanel"
                aria-labelledby="steps-uid-1-h-2"
                class="body"
                aria-hidden="true"
                style="display: none"
              >
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label>Interview For :</label>
                      <input type="text" class="form-control" />
                    </div>
                    <div class="form-group">
                      <label>Interview Type :</label>
                      <select class="form-control">
                        <option>Normal</option>
                        <option>Difficult</option>
                        <option>Hard</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label>Interview Date :</label>
                      <input
                        type="text"
                        class="form-control date-picker"
                        placeholder="Select Date"
                      />
                    </div>
                    <div class="form-group">
                      <label>Interview Time :</label>
                      <input
                        class="form-control time-picker td-input"
                        placeholder="Select time"
                        type="text"
                        readonly=""
                      />
                    </div>
                  </div>
                </div>
              </section>
              <!-- Step 4 -->
              <h5 id="steps-uid-1-h-3" tabindex="-1" class="title">Remark</h5>
              <section
                id="steps-uid-1-p-3"
                role="tabpanel"
                aria-labelledby="steps-uid-1-h-3"
                class="body"
                aria-hidden="true"
                style="display: none"
              >
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label>Behaviour :</label>
                      <input type="text" class="form-control" />
                    </div>
                    <div class="form-group">
                      <label>Confidance</label>
                      <input type="text" class="form-control" />
                    </div>
                    <div class="form-group">
                      <label>Result</label>
                      <select class="form-control">
                        <option>Select Result</option>
                        <option>Selected</option>
                        <option>Rejected</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label>Comments</label>
                      <textarea class="form-control"></textarea>
                    </div>
                  </div>
                </div>
              </section>
            </div>
            <div class="actions clearfix">
              <ul role="menu" aria-label="Pagination">
                <li class="disabled" aria-disabled="true">
                  <a href="#previous" role="menuitem">Previous</a>
                </li>
                <li aria-hidden="false" aria-disabled="false">
                  <a href="#next" role="menuitem">Next</a>
                </li>
                <li aria-hidden="true" style="display: none">
                  <a href="#finish" role="menuitem">Submit</a>
                </li>
              </ul>
            </div>
          </form>
        </div>
      </div>

      <!-- success Popup html Start -->
      <div
        class="modal fade"
        id="success-modal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered" role="document">
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
              <button
                type="button"
                class="btn btn-primary"
                data-dismiss="modal"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- success Popup html End -->
    </div>
    <div class="footer-wrap pd-20 mb-20 card-box">
      DeskApp - Bootstrap 4 Admin Template By
      <a href="https://github.com/dropways" target="_blank"
        >Ankit Hingarajiya</a
      >
    </div>
  </div>
</template>
