/**
 * http://www.privacyidea.org
 * (c) cornelius kölbel, cornelius@privacyidea.org
 *
 * 2015-02-27 Cornelius Kölbel, <cornelius@privacyidea.org>
 *            Add Machines to Web UI
 *
 * This code is free software; you can redistribute it and/or
 * modify it under the terms of the GNU AFFERO GENERAL PUBLIC LICENSE
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or any later version.
 *
 * This code is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU AFFERO GENERAL PUBLIC LICENSE for more details.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */
angular.module("privacyideaApp")
    .controller("machineDetailsController", function ($scope, MachineFactory) {
        $scope.tokensPerPage = 5;
        $scope.newToken = {"serial": "", pin: ""};
        $scope.params = {page: 1};
        // scroll to the top of the page
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        // read the application definition from the server
        MachineFactory.getApplicationDefinition(function(data){
            $scope.Applications = data.result.value;
            var applications = [];
            for(var k in $scope.Applications) applications.push(k);
            $scope.formInit = { application: applications};
        });

        // Change the pagination
        $scope.pageChanged = function () {
            console.log('Page changed to: ' + $scope.params.page);
            $scope.getMachineTokens();
        };

        $scope.getMachineDetails = function () {
            MachineFactory.getMachines({
                id: $scope.machineid,
                resolver: $scope.machineresolver},
            function (data) {
                $scope.machine = data.result.value[0];
            })
        };

        $scope.getMachineTokens = function () {
            MachineFactory.getMachineTokens({machineid: $scope.machineid,
                    resolver: $scope.machineresolver},
                function (data) {
                    tokenlist = data.result.value;
                    $scope.tokenCount = tokenlist.length;
                    var start = ($scope.params.page - 1) * $scope.tokensPerPage;
                    var stop = start + $scope.tokensPerPage;
                    $scope.tokendata = tokenlist.slice(start, stop);
                })
        };

        $scope.getMachineDetails();
        $scope.getMachineTokens();

        $scope.attachToken = function () {
            // newToken.serial, application
            MachineFactory.attachTokenMachine({serial: fixSerial($scope.newToken.serial),
                application: $scope.form.application,
                machineid: $scope.machineid,
                resolver: $scope.machineresolver
            }, function (data) {
                $scope.getMachineTokens();
            });
        };

        $scope.detachMachineToken = function(serial, application) {
            MachineFactory.detachTokenMachine({serial: serial,
                application: application,
                machineid: $scope.machineid,
                resolver: $scope.machineresolver
            }, function (data) {
                $scope.getMachineTokens();
            });
        };

        $scope.editMachineToken = function(serial, application) {
            // TODO edit MachineToken option
            console.log(serial);
            console.log(application);
        }

    });