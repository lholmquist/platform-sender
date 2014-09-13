(function () {
    var TTT_NAMESPACE = 'urn:x-cast:org.lholmquist.attempt';

    var APP_ID = 'BCC26770';

    this._receiverState = 'menu';

    this.sessionListener_ = function(e) {
        console.log('session listerner', e);
        console.log('session id', e.sessionId);
        this.session_ = e;
        e.addUpdateListener(this.sessionUpdateListener_.bind(this));
        e.addMessageListener(TTT_NAMESPACE,
        this.onReceiverMessage_.bind(this));

        // setTimeout(function () {
        //     this.session_.sendMessage(TTT_NAMESPACE,
        //         {type: 'join'},
        //         function () { console.log('success'); },
        //         function(err) { console.log('error', arguments);
        //     });
        // }.bind(this), 1000);
    };

    this.sessionUpdateListener_ = function (e) {
        console.log('session update listener', e);
    };

    this.receiverListener_ = function (e) {
        console.log('recieve listerner', e);
    };

    this.onInitSuccess_ = function (e) {
        console.log('init success', e);
    };

    this.onError_ = function (err) {
        console.log('error', err);
    };

    this.onReceiverMessage_ = function (namespace, message) {
        console.log('message recieved', message);
        var m = JSON.parse(message);
        if (m.event === 'enter') {
            this._receiverState = 'game';
        }
    };

    this.init_ = function () {
        if (!chrome.cast || !chrome.cast.isAvailable) {
            setTimeout(this.init_.bind(this), 1000);
            return;
        }

        var sessionRequest = new chrome.cast.SessionRequest(APP_ID);

        var apiConfig = new chrome.cast.ApiConfig(sessionRequest,
            this.sessionListener_.bind(this),
            this.receiverListener_.bind(this)
        );

        chrome.cast.initialize(apiConfig,
            this.onInitSuccess_.bind(this),
            this.onError_.bind(this)
        );

        document.addEventListener('keydown', function (e) {
            var message = {};

            message = e.keyCode;
            this.session_.sendMessage(TTT_NAMESPACE,
                {message: message, type:'keydown'},
                function () { console.log('success'); },
                function(err) { console.log('error', arguments);}
            );
        }.bind(this), false);
        document.addEventListener('keyup', function (e) {
            var message = {};

            message = e.keyCode;

            this.session_.sendMessage(TTT_NAMESPACE,
                {message: message, type: 'keyup'},
                function () { console.log('success'); },
                function(err) { console.log('error', arguments);}
            );
        }.bind(this), false);
    };

    this.init_();

    this.play_ = function () {
        chrome.cast.requestSession(
            this.sessionListener_.bind(this),
            this.onError_.bind(this)
        );
    };

    document.querySelector('.playButton').addEventListener('click', this.play_.bind(this), false);
})();
