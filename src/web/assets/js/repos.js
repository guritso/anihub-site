fetch('api/config/user').then(r => r.json()).then(d => d.data.accounts.github.username).then(u => fetch(`api/users/${u}/repos`));
