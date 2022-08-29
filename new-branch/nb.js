#!/usr/bin/env node

const prompts = require("prompts");
const kebabCase = require("just-kebab-case");
const { exec } = require("child_process");

const jiraProjectCode = "CPE";

(async () => {
  const response = await prompts([
    {
      type: "select",
      name: "type",
      message: "Issue type",
      choices: [
        { title: "Feature", value: "feat" },
        { title: "Fix", value: "fix" },
      ],
    },
    {
      type: "text",
      name: "code",
      message: `Issue code? '${jiraProjectCode}-' is the default`,
      format: (val) => {
        const number = parseInt(val);
        if (!!number) {
          return `${jiraProjectCode}-${number}`;
        }
        return val;
      },
      validate: (value) => {
        const regex = /^([a-zA-Z)]{3}-)?\d+$/;
        return value.match(regex) || "Invalid code";
      },
    },
    {
      type: "text",
      name: "description",
      message: "Small description of the task",
      format: (val) => kebabCase(val),
      validate: (value) => value.length || "Invalid description",
    },
  ]);
  const { type, code, description } = response;
  const branchName = `${type}/${code}/${description}`;
  exec(`git checkout -b ${branchName}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`error: ${error.message}`);
      return;
    }

    console.log(stdout);
  });
})();
