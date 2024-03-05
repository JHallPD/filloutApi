import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;



// individual question found in each response
type question = {
	id:string,
	name:string,
	type:string,
	value:string | number;
};

// response mock, anys included to keep things simple
type response = {
	submissionId:string,
	submissionTime:string,
	lastUpdatedAt:string,
	questions:question[],
	calculations: any[],
	urlParameters:any[],
	quiz:{},
	documents:[];
};
// keep results form for send.
type formResults = {
	responses: response[],
	totalResponses: number,
	pageCount: number;
};

// Used to filter the Fillout results
type FilterClauseType = {
	id: string,
	condition: 'equals' | 'does_not_equal' | 'greater_than' | 'less_than',
	value: number | string;
};

// each of these filters should be applied like an AND in a "where" clause
// in SQL
type ResponsesFiltersType = FilterClauseType[];

// test filter expects to return 1 out of 11 responses
const testFilter: ResponsesFiltersType = [
	{
		id: "bE2Bo4cGUv49cjnqZ4UnkW",
		condition: "equals",
		value: "Johnny",
	},
	{
		id: "dSRAe3hygqVwTpPK69p5td",
		condition: "greater_than",
		value: "2024-01-01"
	}
];
// test filter stringified for url
const testStringFilter = encodeURIComponent(JSON.stringify(testFilter));



// filter param is optional for testing purposes
app.get('/:formId/filteredResponses/:filter?', (req, res) => {

	// variable setup and inital param capture
	let formId = req.params.formId,
		filteredResponses: formResults = {
		responses: [],
		totalResponses: 0,
		pageCount: 1
	};
	let filters: ResponsesFiltersType = JSON.parse(decodeURIComponent(req.params.filter !== undefined?req.params.filter:testStringFilter));
	// Fillout url options
	const options = {
		method: 'GET',
		headers: {
			'Authorization': "Bearer "+ process.env.FORM_KEY,
		}
	};	
	fetch(`https://api.fillout.com/v1/api/forms/${formId}/submissions`, options)
	  .then(res => res.json())
	  .then(json =>  {
		for (let i = 0; i < json.responses.length; i++) {
		  let responseCheck = false;
		  // loop over each responses questions array and determine if it matches the filter criteria. 
		  json.responses[i].questions.forEach((question: question)=>{
			// loop over each filter and look for a match
			filters.forEach((filter)=>{
			  if(question.id === filter.id){
				switch(true){
				  case filter.condition === 'equals':
					filter.value === question.value ? null:responseCheck=true;
					break;
				  case filter.condition === 'does_not_equal':
					filter.value !== question.value ? null:responseCheck=true;
					break;
				  case filter.condition === 'greater_than':
					filter.value < question.value ? null:responseCheck=true;
					break;
				  case filter.condition === 'less_than':
					filter.value > question.value ? null:responseCheck=true;
					break;
				  default:
					console.error('error:' + "Condition Invalid");
				}
			  }
			})
  
		  })
		  // if matches for the filter are found they will be added to the return data here
		  if(!responseCheck){
			filteredResponses.responses.push(json.responses[i]);
			filteredResponses.totalResponses += 1;
  
			filteredResponses.pageCount = Math.ceil(filteredResponses.totalResponses/20)
		  }
		}
		res.send(filteredResponses);
	})
	.catch(err => console.error('error:' + err));

	
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});