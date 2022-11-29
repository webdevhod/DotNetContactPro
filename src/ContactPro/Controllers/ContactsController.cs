
using System.Threading;
using System.Collections.Generic;
using System.Threading.Tasks;
using JHipsterNet.Core.Pagination;
using ContactPro.Domain.Entities;
using ContactPro.Crosscutting.Enums;
using ContactPro.Crosscutting.Exceptions;
using ContactPro.Web.Extensions;
using ContactPro.Web.Filters;
using ContactPro.Web.Rest.Utilities;
using ContactPro.Domain.Repositories.Interfaces;
using ContactPro.Domain.Services.Interfaces;
using ContactPro.Infrastructure.Web.Rest.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;

namespace ContactPro.Controllers
{
    [Authorize]
    [Route("api/contacts")]
    [ApiController]
    public class ContactsController : ControllerBase
    {
        private const string EntityName = "contact";
        private readonly ILogger<ContactsController> _log;
        private readonly IContactRepository _contactRepository;

        public ContactsController(ILogger<ContactsController> log,
        IContactRepository contactRepository)
        {
            _log = log;
            _contactRepository = contactRepository;
        }

        [HttpPost]
        [ValidateModel]
        public async Task<ActionResult<Contact>> CreateContact([FromBody] Contact contact)
        {
            _log.LogDebug($"REST request to save Contact : {contact}");
            if (contact.Id != 0)
                throw new BadRequestAlertException("A new contact cannot already have an ID", EntityName, "idexists");

            await _contactRepository.CreateOrUpdateAsync(contact);
            await _contactRepository.SaveChangesAsync();
            return CreatedAtAction(nameof(GetContact), new { id = contact.Id }, contact)
                .WithHeaders(HeaderUtil.CreateEntityCreationAlert(EntityName, contact.Id.ToString()));
        }

        [HttpPut("{id}")]
        [ValidateModel]
        public async Task<IActionResult> UpdateContact(long id, [FromBody] Contact contact)
        {
            _log.LogDebug($"REST request to update Contact : {contact}");
            if (contact.Id == 0) throw new BadRequestAlertException("Invalid Id", EntityName, "idnull");
            if (id != contact.Id) throw new BadRequestAlertException("Invalid Id", EntityName, "idinvalid");
            await _contactRepository.CreateOrUpdateAsync(contact);
            await _contactRepository.SaveChangesAsync();
            return Ok(contact)
                .WithHeaders(HeaderUtil.CreateEntityUpdateAlert(EntityName, contact.Id.ToString()));
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Contact>>> GetAllContacts(IPageable pageable)
        {
            _log.LogDebug("REST request to get a page of Contacts");
            var result = await _contactRepository.QueryHelper()
                .Include(contact => contact.User)
                .GetPageAsync(pageable);
            return Ok(result.Content).WithHeaders(result.GeneratePaginationHttpHeaders());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetContact([FromRoute] long id)
        {
            _log.LogDebug($"REST request to get Contact : {id}");
            var result = await _contactRepository.QueryHelper()
                .Include(contact => contact.User)
                .GetOneAsync(contact => contact.Id == id);
            return ActionResultUtil.WrapOrNotFound(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteContact([FromRoute] long id)
        {
            _log.LogDebug($"REST request to delete Contact : {id}");
            await _contactRepository.DeleteByIdAsync(id);
            await _contactRepository.SaveChangesAsync();
            return NoContent().WithHeaders(HeaderUtil.CreateEntityDeletionAlert(EntityName, id.ToString()));
        }
    }
}
