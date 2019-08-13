const fetch = require('node-fetch')
const { EmptyEmbed, EmptyMessage } = require('./libs/errors')

function isEmpty(obj) {
	return Object.keys(obj).length === 0 && obj.constructor === Object
}
module.exports = class Dischook {
	/**
	 * @param {String} url Webhook URL
	 * @param {String} [name] Name of webhook
	 * @param {String} [avatar_url] URL for avatar
	 * @description Initialization for Dischook to send a message through the webhook URL
	 */
	constructor(url, name = null, avatar_url = null) {
		this['webhook'] = url
		this['name'] = name
		this['avatar_url'] = avatar_url
		this['message'] = {
			embeds: [{}]
		}
		if (name) Object.assign(this.message, {
			'username': name
		})
		if (avatar_url && this.avatar_url) Object.assign(this.message, {
			'avatar_url': avatar_url
		})
	}
	/**
	 * @param {string} text The title's value
	 * @description Sets the title of the embed (1)
	 */
	setTitle(text) {
		Object.assign(this.message.embeds[0], {
			title: text
		})
		return this
	}
	/**
	 * @param {text} text The descriptions value
	 * @description Sets a description of the embed (1)
	 */
	setDescription(text) {
		Object.assign(this.message.embeds[0], {
			description: text
		})
		return this
	}
	/**
	 * @param {String} title Fields title
	 * @param {String} value Fields value 
	 * @param {Boolean} [inline=false] Inline field or not
	 * @description Adds a field into the embed (infinite)
	 */
	addField(title, value, inline = false) {
		if (!this.message.embeds[0].fields) {
			Object.assign(this.message.embeds[0], {
				fields: new Array
			})
		}
		this.message.embeds[0].fields.push({
			name: title,
			value: value,
			inline: inline
		})
		return this
	}
	/**
	 * @param {(String|Number)} text (HEX) Embeds color
	 * @description Changes the side bar color of the embed (1)
	 */
	setColor(text) {
		text = text.replace(/#/g, '')
		text = parseInt(text, 16)
		Object.assign(this.message.embeds[0], {
			color: text
		})
		return this
	}
	/**
	 * @param {string} text Footers value
	 * @description Sets the footer of the embed (1)
	 */
	setFooter(text) {
		Object.assign(this.message.embeds[0], {
			footer: {
				'text': text
			}
		})
		return this
	}
	/**
	 * @param {string} url Embeds image 
	 */
	setImage(url) {
		Object.assign(this.message.embeds[0], {
			image: {
				'url': url
			}
		})
		return this
	}
	/**
	 * 
	 * @param {string} name the text of the author
	 * @param {string} image the icon url
	 * @param {string} url the url of the name 
	 */
	setAuthor(name, image = null, url = null) {
		Object.assign(this.message.embeds[0], {
			author: {
				'name': name,
				'url': url,
				'icon_url': image,
			}
		})
		return this
	}
	/**
	 * @returns Current date
	 * @description Adds a timestamp into the embed, with the time the message was sent at (1)
	 */
	setTimestamp() {
		Object.assign(this.message.embeds[0], {
			timestamp: new Date()
		})
		return this
	}
	/**
	 * @param {string} message Plain message
	 * @returns Message to discord channel sent through webhook with POST request
	 */
	send(message = null) {
		if (isEmpty(this.message.embeds[0]) && message) {
			if (!message.replace(/\s/g, '').length) throw new EmptyMessage()
			fetch(this.webhook, {
				method: 'post',
				body: JSON.stringify({username: this.name,avatar_url: this.avatar_url,content: message}),
				headers: { 'Content-Type': 'application/json' },
			})

			/*return fetch.post(this.webhook)
				.send({
					username: this.name,
					avatar_url: this.avatar_url,
					content: message
				})
				.then().catch(console.error)
				*/
		}
		if (!message && isEmpty(this.message.embeds[0])) throw new EmptyEmbed('main.js')
		fetch(this.webhook, {
			method: 'post',
			body: JSON.stringify(this.message),
			headers: { 'Content-Type': 'application/json' },
		})
	}
}