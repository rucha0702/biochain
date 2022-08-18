// Copyright © 2021 Kaleido, Inc.
//
// SPDX-License-Identifier: Apache-2.0
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
import axios from 'axios';
export class FireFly {
    constructor(host) {
        this.ns = 'default';
        this.rest = axios.create({ baseURL: `${host}/api/v1` });
    }
    async sendBroadcast(data) {
        await this.rest.post(`/namespaces/${this.ns}/messages/broadcast`, { data });
    }
    async sendPrivate(privateMessage) {
        await this.rest.post(`/namespaces/${this.ns}/messages/private`, privateMessage);
    }
    async getMessages(limit) {
        const response = await this.rest.get(`/namespaces/${this.ns}/messages?limit=${limit}&type=private&type=broadcast`);
        return response.data;
    }
    async getStatus() {
        const response = await this.rest.get(`/status`);
        return response.data;
    }
    async getOrgs() {
        const response = await this.rest.get(`/network/organizations`);
        return response.data;
    }
    retrieveData(data) {
        return Promise.all(data.map((d) => this.rest
            .get(`/namespaces/${this.ns}/data/${d.id}`)
            .then((response) => response.data)));
    }
}
