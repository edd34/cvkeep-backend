const log = require('logflake')('change-privacy');

const {
	__cv,
	__user,
} = require('../../../functions/');

module.exports = (req, res) => {
	const useremail = req.$user.email;
	const privacy = req.body.privacy;

	const cvPrivacy = {
		allowPublicMessages: privacy.allowPublicMessages,
		passwordProtected: privacy.cvPasswordProtected.enabled,
	};

	if (!privacy || !useremail) {
		return res.status(400).json({ updated: false, errors: ['error.notEnoughDataOrMalformedRequest'] });
	}

	new Promise(async (resolve, reject) => {
		const userUpdateStatus = await __user.update(useremail, { privacy }).catch(reject);
		const cvUpdateStatus = await __cv.update(useremail, cvPrivacy).catch(reject);
		resolve({ userUpdateStatus, cvUpdateStatus });
	})
		.then(status => {
			return res.status(200).json({ updated: true, errors: false, status: status });
		})
		.catch(error => {
			log('error', error);

			return res.status(500).json({ updated: false, errors: [res.i18n.t(error)] });
		});
};
