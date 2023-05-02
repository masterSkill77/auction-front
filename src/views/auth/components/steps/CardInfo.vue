<template>
  <section
    id="steps-uid-0-p-2"
    role="tabpanel"
    aria-labelledby="steps-uid-0-h-2"
    class="body"
    aria-hidden="true"
  >
    <div class="form-wrap max-width-600 mx-auto">
      <div class="form-group row">
        <label class="col-sm-4 col-form-label">Credit Card Type</label>
        <div class="col-sm-8">
          <select class="form-control" title="Select Card Type">
            <option class="bs-title-option" value=""></option>
            <option value="1">Option 1</option>
            <option value="2">Option 2</option>
            <option value="3">Option 3</option>
          </select>
        </div>
      </div>
      <div class="form-group row align-items-center">
        <label class="col-sm-4 col-form-label">Credit Card Number</label>
        <div class="col-sm-8">
          <input type="text" class="form-control" />
        </div>
      </div>
      <div class="form-group row">
        <label class="col-sm-4 col-form-label">CVC</label>
        <div class="col-sm-5">
          <input type="text" class="form-control" />
        </div>
      </div>
      <div class="form-group row">
        <label class="col-sm-4 col-form-label">Expiration Date</label>
        <div class="col-sm-8">
          <div class="row">
            <div class="col-6">
              <select class="form-control" title="Month" data-size="5">
                <option class="bs-title-option" value=""></option>
                <option value="01">January</option>
                <option value="02">February</option>
                <option value="03">March</option>
                <option value="04">April</option>
                <option value="05">May</option>
                <option value="06">June</option>
                <option value="07">July</option>
                <option value="08">August</option>
                <option value="09">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
            </div>
            <div class="col-6">
              <select
                class="form-control"
                title="Year"
                data-size="5"
                tabindex="-98"
              >
                <option class="bs-title-option" value=""></option>
                <option>2020</option>
                <option>2019</option>
                <option>2018</option>
                <option>2017</option>
                <option>2016</option>
                <option>2015</option>
                <option>2014</option>
                <option>2013</option>
                <option>2012</option>
                <option>2011</option>
                <option>2010</option>
                <option>2009</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
export default {};
</script>
