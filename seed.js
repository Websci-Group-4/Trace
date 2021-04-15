const mongoose = require("mongoose");
mongoose.connect(require("./config.json").server.dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;

const bcrypt = require('bcrypt');
const saltRounds = 10;

function getRandom(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}

const assignUsersToOrgs = async (models,users,orgs) => {
    let assignedUsers = []
    users.forEach(user => assignedUsers.push(new Promise((res,rej) => {
        const rand_org = getRandom([...orgs,{}],1)
        if(!Object.keys(rand_org[0]).length) {
            res();
        } else {
            Promise.all([
                models.Organization.updateOne({_id: rand_org[0]._id}, {$addToSet: {users: user._id}}),
                models.User.updateOne({_id: user._id}, {organization: rand_org[0]._id})
            ]).then(re => {res()})
        }
    })))
    return Promise.all(assignedUsers)
}

const makeImageOwners = async (models,users,images) => {
    let userperms = []
    images.forEach(image => userperms.push(new Promise((res,rej) => {
        const rand_user = getRandom(users,1)
        models.Permission.create({user: rand_user[0]._id, can: "OWN", image: image._id}).then(perm => {
            Promise.all([
                models.Image.updateOne({_id: image._id}, {$addToSet: {permissions: perm._id}}),
                models.User.updateOne({_id: rand_user[0]._id}, {$addToSet: {permissions: perm._id}})
            ]).then(re => {res(perm)})
        })
    })))
    return Promise.all(userperms)
}

const makeImageEditors = async (models,users,images) => {
    let userperms = []
    images.forEach(image => userperms.push(new Promise((res,rej) => {
        const rand_users = getRandom(users,parseInt(Math.random()*(5-0)+0))
        let usrs = []
        rand_users.forEach(usr => usrs.push(new Promise((res2,rej2) => {
            models.Permission.create({user: usr._id, can: "EDIT", image: image._id}).then(perm => {
                Promise.all([
                    models.Image.updateOne({_id: image._id}, {$addToSet: {permissions: perm._id}}),
                    models.User.updateOne({_id: usr._id}, {$addToSet: {permissions: perm._id}})
                ]).then(re => {res2(perm)})
            })
        })))
        Promise.all(usrs).then(re => res(re))
    })))
    return Promise.all(userperms.flat())
}

const makeImageViewers = async (models,users,images) => {
    let userperms = []
    images.forEach(image => userperms.push(new Promise((res,rej) => {
        const rand_users = getRandom(users,parseInt(Math.random()*(5-0)+0))
        let usrs = []
        rand_users.forEach(usr => usrs.push(new Promise((res2,rej2) => {
            models.Permission.create({user: usr._id, can: "VIEW", image: image._id}).then(perm => {
                Promise.all([
                    models.Image.updateOne({_id: image._id}, {$addToSet: {permissions: perm._id}}),
                    models.User.updateOne({_id: usr._id}, {$addToSet: {permissions: perm._id}})
                ]).then(re => {res2(perm)})
            })
        })))
        Promise.all(usrs).then(re => res(re))
    })))
    return Promise.all(userperms.flat())
}

const makeImageViews = async (models,perms) => {
    let views = []
    console.log(perms)
    perms.forEach(perm => views.push(new Promise((res,rej) => {
        let rand_views = [...Array(parseInt(Math.random()*(10-0)+0)).keys()]
        let views = []
        rand_views.forEach(i => views.push(new Promise((res2,rej2) => {
            models.View.create({user: perm.user, time: Date.now(), image: perm.image}).then(view => {
                res2(view)
            })
        })))
        Promise.all(views).then(re => res(re))
    })))
    return Promise.all(views.flat())
}

const seed = async (models) => {
    console.log("Seeding... please hold...")
    return new Promise((finalResolve,reject) => {
        let deletions = []
        Object.keys(models).forEach(modelName => deletions.push(models[modelName].deleteMany({})))
        Promise.all(deletions).then(res => {
            var orgs = []
            const org_itr = [...Array(parseInt(Math.random() * (10-5) + 5)).keys()]
            org_itr.forEach(i => {
                orgs.push(models.Organization.create({
                    name: "Org"+i,
                    baseUrls: ["org"+i+".xyz","org"+i+".com"],
                    users: []
                }))
            })
            Promise.all(orgs).then(res_orgs => {
                var users = []
                const user_itr = [...Array(parseInt(Math.random() * (75-50) + 50)).keys()]
                user_itr.forEach(i => {
                    users.push(models.User.create({
                        firstName: "User",
                        lastName: String(i),
                        email: "user"+i+"@abc.xyz",
                        password: bcrypt.hashSync("password",saltRounds),
                        permissions: [],
                        role: "USER"
                    }))
                })
                Promise.all(users).then(res_users => {
                    var images = []
                    const img_itr = [...Array(parseInt(Math.random() * (20-10) + 10)).keys()]
                    img_itr.forEach(i => {
                        images.push(models.Image.create({
                            url: "https://picsum.photos/512/512",
                            permissions: [],
                            views: []
                        }))
                    })
                    Promise.all(images).then(res_images => {
                        assignUsersToOrgs(models,res_users,res_orgs).then(res => {
                            Promise.all([
                                makeImageOwners(models,res_users,res_images),
                                makeImageEditors(models,res_users,res_images),
                                makeImageViewers(models,res_users,res_images)
                            ]).then(resperms => {
                                makeImageViews(models,resperms.flat().flat()).then(res => {
                                    finalResolve();
                                })
                            })
                        })
                    })
                })
            })
        })
    })
}

// Application starts if Node connects to our database successfully.
db.once('open', function() {
    const models = {
        Image: require("./models/Image.Model"),
        Organization: require("./models/Organization.Model"),
        Permission: require("./models/Permission.Model"),
        User: require("./models/User.Model"),
        View: require("./models/View.Model")
    }
    seed(models).then(res => {
        console.log("Done.")
        db.close(function(error) {
            if(error) {
                console.log(error);
            } else {
                console.log(`Mongoose connection closed.`);
            }
        });
    })
});

// Application fails if Node fails to connect to our database.
db.on('error', function() {
    console.log(`Mongoose connection to database FAILED.`);
    throw new Error(`Unable to connect to MongoDB database.`);
});