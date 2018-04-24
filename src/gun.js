const { WebClient } = require('@slack/client');
const Mustache = require('mustache');

async function sendMessage(slack, { id, profile }, template) {
    let text;
    
    try {
        text = Mustache.render(template, profile);
    } catch(error) {
        throw { data: { error: 'invalid_template' }};
    }

    try {
        const result = await slack.chat.postMessage({
            channel: id,
            as_user: true,
            text
        });
    } catch (error) {
        return email;
    }
}

function createUserMap({ members }) {
    return members.reduce((obj, cur) => {
        if (cur.profile.email) {
            obj[cur.profile.email.toUpperCase()] = cur;
        }
        return obj;
    }, {});
}

async function slackgun({ token, emails, template }) {
    const slack = new WebClient(token);
    const users = createUserMap(await slack.users.list());
    
    emails = emails
        .match(/[^\r\n\,]+/g)
        .map(email => email.toUpperCase().trim());
    
    console.log(emails);
    const selectedUsers = [];
    const invalidEmails = [];
    
    emails.forEach(email => {
        if (users[email]) {
            selectedUsers.push(users[email]);
        } else {
            invalidEmails.push(email);
        }
    });

    const result = await Promise.all(selectedUsers.map(user => sendMessage(slack, user, template)));
    const errors = result.filter(email => email);
    const sent = selectedUsers
        .filter(user => errors.indexOf(user.profile.email < 0))
        .map(user => user.profile.email);
    
    return {
        sent,
        invalidEmails,
        errors
    }
}

module.exports = slackgun; 