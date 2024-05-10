const fs = require('fs');

const companies = JSON.parse(fs.readFileSync('companies.json', 'utf-8'));
const users = JSON.parse(fs.readFileSync('users.json', 'utf-8'));

let output = ''; 

companies.forEach(company => {
    
    output += `Company Id: ${company.id}\n`;
    output += `\tCompany Name: ${company.name}\n`;
    let usersEmailed = ''; 
    let usersNotEmailed = ''; 
    const companyUsers = users.filter(user => user.company_id === company.id);
    companyUsers.sort((a, b) => {
        if (a.last_name < b.last_name) return -1;
        if (a.last_name > b.last_name) return 1;
        return 0;
    });
    
    companyUsers.forEach(user => {

        if (user.active_status) {
            user.tokens += company.top_up;
            user.tokens = Math.max(user.tokens, 0);
        }

        const previousBalance = user.tokens - (user.active_status ? company.top_up : 0);

        if (user.email_status) {
            usersEmailed += `\t${user.last_name}, ${user.first_name}, ${user.email}\n`;
            usersEmailed += `\t  Previous Token Balance, ${Math.max(previousBalance, 0)}\n`;
            usersEmailed += `\t  New Token Balance, ${user.tokens}\n`;
        } else {
            usersNotEmailed += `\t${user.last_name}, ${user.first_name}, ${user.email}\n`;
            usersNotEmailed += `\t  Previous Token Balance, ${Math.max(previousBalance, 0)}\n`;
            usersNotEmailed += `\t  New Token Balance, ${user.tokens}\n`;
        }
    });

    output += `\tUsers Emailed:\n${usersEmailed}`;
    output += `\tUsers Not Emailed:\n${usersNotEmailed}`;

    const totalTopUps = companyUsers.reduce((acc, user) => acc + company.top_up, 0);

    output += `\tTotal amount of top ups for ${company.name}: ${totalTopUps}\n\n`;
});

fs.writeFileSync('output.txt', output);