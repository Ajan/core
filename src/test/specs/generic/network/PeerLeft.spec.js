describe('PeerLeft', () => {
    beforeEach(function () {
        MockNetwork.install();
    });

    afterEach(function () {
        MockNetwork.uninstall();
    });


    it('should be able to disconnect triggering peer-left', (done) => {
        function checkPeerLeft(peer) {
            expect(true).toBe(true);
            done();
        }

        (async () => {
            const netconfig = Dummy.NETCONFIG;
            const consensus1 = await Consensus.volatileFull(netconfig);
            consensus1.network.on('peer-left', peer => checkPeerLeft(peer));

            const netconfig2 = new RtcNetworkConfig();
            const consensus2 = await Consensus.volatileLight(netconfig2);

            consensus2.on('established', () => {
                setTimeout(() => consensus2.network.disconnect("test"), 0);
            });

            consensus2.network.connect();
        })().catch(done.fail);
    });
});

