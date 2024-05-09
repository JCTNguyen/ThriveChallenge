const fs = require('fs');

// Read JSON data from files
const companies = JSON.parse(fs.readFileSync('companies.json', 'utf-8'));
const users = JSON.parse(fs.readFileSync('users.json', 'utf-8'));

let output = ''; // Initialize output variable

// Process each company
companies.forEach(company => {
    // Initialize output for this company
    output += `Company Id: ${company.id}\n`;
    output += `\tCompany Name: ${company.name}\n`;
    let usersEmailed = ''; // String to store users emailed
    let usersNotEmailed = ''; // String to store users not emailed

    // Filter users belonging to this company
    const companyUsers = users.filter(user => user.company_id === company.id);
    
    // Sort users alphabetically by last name
    companyUsers.sort((a, b) => {
        if (a.last_name < b.last_name) return -1;
        if (a.last_name > b.last_name) return 1;
        return 0;
    });

    // Process each user
    companyUsers.forEach(user => {
        // Check if the user is active
        if (user.active_status) {
            // Top up the user's tokens by the company's top-up amount
            user.tokens += company.top_up;

            // Ensure the token balance is never negative
            user.tokens = Math.max(user.tokens, 0);
        }

        // Calculate previous token balance
        const previousBalance = user.tokens - (user.active_status ? company.top_up : 0);

        // Output user details
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

    // Output users emailed and not emailed
    output += `\tUsers Emailed:\n${usersEmailed}`;
    output += `\tUsers Not Emailed:\n${usersNotEmailed}`;

    // Calculate total top-ups for this company
    const totalTopUps = companyUsers.reduce((acc, user) => acc + company.top_up, 0);

    // Output total amount of top-ups
    output += `\tTotal amount of top ups for ${company.name}: ${totalTopUps}\n\n`;
});

// Write output to output.txt
fs.writeFileSync('output.txt', output);