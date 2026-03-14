class GitLab
{
  constructor(external_url, access_token, group) {
    this.external_url = external_url;
    this.access_token = access_token;
    this.group = group;
  }

  async _getProjectMergeRequest(project_id,{page=1}) {
    const res = await fetch(
      `${this.external_url}/api/v4/projects/${project_id}/merge_requests?state=opened&page=${page}`,
      { headers: { 'PRIVATE-TOKEN': this.access_token } }
    );
    return res.json();
  }

  async getProjectMergeRequests(project_id) {
    const res = await fetch(
      `${this.external_url}/api/v4/projects/${project_id}/merge_requests?state=opened`,
      { headers: { 'PRIVATE-TOKEN': this.access_token } }
    );
    const firstPage = await res.json();
    const totalPages = Number(res.headers.get('x-total-pages'));

    let promises = []
    for(let pageNumber = 2; pageNumber <= totalPages; pageNumber++) {
      promises.push(this._getProjectMergeRequest(project_id,{ page: pageNumber }));
    }

    let merge_requests = firstPage;
    if (totalPages > 1) {
      merge_requests = merge_requests.concat(await Promise.all(promises));
    }
    return merge_requests;
  }

  async _getProject({ page = 1 }) {
    const res = await fetch(
      `${this.external_url}/api/v4/groups/${this.group}/projects?page=${page}`,
      { headers: { 'PRIVATE-TOKEN': this.access_token } }
    );
    return res.json();
  }

  async getProjects() {
    const res = await fetch(
      `${this.external_url}/api/v4/groups/${this.group}/projects`,
      { headers: { 'PRIVATE-TOKEN': this.access_token } }
    );
    const firstPage = await res.json();
    const totalPages = Number(res.headers.get('x-total-pages'));

    let promises = []
    for(let pageNumber = 2; pageNumber <= totalPages; pageNumber++) {
      promises.push(this._getProject({ page: pageNumber }));
    }

    let projects = firstPage;
    if (totalPages > 1) {
      projects = projects.concat(await Promise.all(promises));
    }

    return projects;
  }

  async getGroupMergeRequests() {
    const projects = await this.getProjects();
    const merge_requests = await Promise.all(
      projects
        .filter((project) => project.id !== undefined)
        .map((project) => this.getProjectMergeRequests(project.id))
    );
    return [].concat(...merge_requests);
  }
}

module.exports = GitLab;
