const form = document.querySelector("#search-form");
const form_input = document.querySelector("#search-input");
const checkbox_inputs = document.querySelectorAll(".checkboxcontainer")
const adding_alert = document.querySelector(".adding_alert")

form.addEventListener("submit", (event) => {
  const array = []
  for (let index = 0; index < checkbox_inputs.length; index++) {
    const element = array[index];
    if (index > 0) {
      array.push(document.querySelector(`#checkbox${index+1}`).checked)
    } else {
      array.push(document.querySelector("#checkbox").checked)
    }
  }
  event.preventDefault() // to prevent <form>'s native behaviour
  // console.log(event)
  // console.log({"text": `${form_input.value}`, "biometric_identification": `${array[0]}`, "critical_infrastructure": `${array[1]}`, "education": `${array[2]}`, "employment": `${array[3]}`, "restrict_access": `${array[4]}`, "law_enforcement": `${array[5]}`, "migration": `${array[6]}`, "democratic_processes": `${array[7]}`})
  fetch("http://reg-score.germanywestcentral.azurecontainer.io:8080/score", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({"text": `${form_input.value}`, "biometric_identification": `${array[0]}`, "critical_infrastructure": `${array[1]}`, "education": `${array[2]}`, "employment": `${array[3]}`, "restrict_access": `${array[4]}`, "law_enforcement": `${array[5]}`, "migration": `${array[6]}`, "democratic_processes": `${array[7]}`})
  })
    .then(response => response.json())
    .then((data) => {
      console.log(data)
      const progressbar = document.querySelector(".progress-bar")
      const text_output_field = document.querySelector(".text-output-field")
      progressbar.innerHTML = ""
      text_output_field.innerHTML = ""
      risk_value = data["result"]["risk"]
      human_value = data["result"]["human"]
      if (form_input.value.length > 150) {
        const risk_value_skaled = risk_value * 60.1
        const human_value_skaled = human_value * 60.1
        if (risk_value > 0.5 ) {
          const tag_risky = `
          <div class="container">
            <div class="content">
              <p class="font big">Your results:</p>
              <div class="resultcontainer">
                <div class="circle font big">1</div>
                <div class="gap"></div>
                <p class="font medium">Your AI classifies as high risk.</p>
              </div>
              <div class="resultcontainer">
                <div class="riskbarometer">
                  <div class="barometercircle" style="margin-left: ${risk_value_skaled}vw;"></div>
                </div>
              </div>
            </div>
          </div>`
          progressbar.insertAdjacentHTML("afterbegin", tag_risky)
        } else {
          const tag_not_risky = `
          <div class="container">
            <div class="content">
              <p class="font big">Your results:</p>
              <div class="resultcontainer">
                <div class="circle font big">1</div>
                <div class="gap"></div>
                <p class="font medium">Your AI classifies as low risk.</p>
              </div>
              <div class="resultcontainer">
                <div class="riskbarometer">
                  <div class="barometercircle" style="margin-left: ${risk_value_skaled}vw;"></div>
                </div>
              </div>
            </div>
          </div>`
          progressbar.insertAdjacentHTML("afterbegin", tag_not_risky)
        }
        if (human_value > 0.5 ) {
          const tag_risky = `
          <div class="container">
            <div class="content">
              <div class="resultcontainer">
                <div class="circle font big">2</div>
                <div class="gap"></div>
                <p class="font medium">Your AI interacts with humans.</p>
              </div>
              <div class="resultcontainer">
                <div class="riskbarometer">
                  <div class="barometercircle" style="margin-left: ${human_value_skaled}vw;"></div>
                </div>
              </div>
            </div>
          </div>`
          progressbar.insertAdjacentHTML("beforeend", tag_risky)
        } else {
          const tag_not_risky = `
          <div class="container">
            <div class="content">
              <div class="resultcontainer">
                <div class="circle font big">2</div>
                <div class="gap"></div>
                <p class="font medium">Your AI does not interact with humans.</p>
              </div>
              <div class="resultcontainer">
                <div class="riskbarometer">
                  <div class="barometercircle" style="margin-left: ${human_value_skaled}vw;"></div>
                </div>
              </div>
            </div>
          </div>`
          progressbar.insertAdjacentHTML("beforeend", tag_not_risky)
        }
        text_output_field.insertAdjacentHTML("beforeend", `
        <div class="container">
          <div class="divider"></div>
        </div>
        <div class="container">
          <div class="content">
            <p class="font big">Analysis of your Input:</p>
            <p class="font medium">Percentage of your description that classifies as high risk: ${risk_value*100}%</p>
            <p class="font medium">Percentage of your description that classifies for human interaction: ${human_value*100}%</p>
            <br>
            <div class="resultcontainer white-box">
              <div class="gap"></div>
              <p>${form_input.value}</p>
            </div>
          </div>
          <br>
        </div>`)
        const remove_after_results = document.querySelectorAll(".remove-after-results");
        remove_after_results.forEach(e => {
          e.innerHTML = ""
        });
      } else {
        adding_alert.innerHTML = ""
        const tag_alert = `<div class="resultcontainer alert-box">
        <div class="gap"></div>
          <p class="font medium">Please write atleast 300 words.</p>
        </div><br>`
        adding_alert.insertAdjacentHTML("beforeend", tag_alert)
      }
    });
  // text_output_field.innerText = form_input.value
});
