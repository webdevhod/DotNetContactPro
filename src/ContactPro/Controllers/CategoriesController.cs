using ContactPro.Crosscutting.Exceptions;
using ContactPro.Domain.Entities;
using ContactPro.Domain.Repositories.Interfaces;
using ContactPro.Domain.Services;
using ContactPro.Infrastructure.Data;
using ContactPro.Infrastructure.Web.Rest.Utilities;
using ContactPro.Web.Extensions;
using ContactPro.Web.Filters;
using ContactPro.Web.Rest.Utilities;
using JHipsterNet.Core.Pagination;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ContactPro.Controllers
{
    [Authorize]
    [Route("api/categories")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private const string EntityName = "category";
        private readonly ILogger<CategoriesController> _log;
        private readonly ICategoryRepository _categoryRepository;
        private readonly ApplicationDatabaseContext _context;
        private UtilityService _utilityService;


        public CategoriesController(ILogger<CategoriesController> log,
        ICategoryRepository categoryRepository,
        ApplicationDatabaseContext context,
        UserManager<User> userManager,
        IHttpContextAccessor httpContextAccessor)
        {
            _log = log;
            _categoryRepository = categoryRepository;
            _context = context;
            _utilityService = new UtilityService(userManager, httpContextAccessor);
        }

        [HttpPost]
        [ValidateModel]
        public async Task<ActionResult<Category>> CreateCategory([FromBody] Category category)
        {
            _log.LogDebug($"REST request to save Category : {category}");
            if (category.Id != 0)
                throw new BadRequestAlertException("A new category cannot already have an ID", EntityName, "idexists");

            category.Created = _utilityService.GetNowInUtc();           
            category.UserId = _utilityService.GetCurrentUserId();
            await CheckAllContacts(category);
            
            await _categoryRepository.CreateOrUpdateAsync(category);
            await _categoryRepository.SaveChangesAsync();
            return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, category)
                .WithHeaders(HeaderUtil.CreateEntityCreationAlert(EntityName, category.Id.ToString()));
        }

        [HttpPut("{id}")]
        [ValidateModel]
        public async Task<IActionResult> UpdateCategory(long id, [FromBody] Category category)
        {
            _log.LogDebug($"REST request to update Category : {category}");
            if (category.Id == 0) throw new BadRequestAlertException("Invalid Id", EntityName, "idnull");
            if (id != category.Id) throw new BadRequestAlertException("Invalid Id", EntityName, "idinvalid");
            if (!_utilityService.GetCurrentUserId().Equals(category.UserId)) throw new BadRequestAlertException("User Id and Category User Id doesn't match", EntityName, "useridmatch");            
            Category oldCategory = await _categoryRepository.QueryHelper().GetOneAsync(c => c.Id == id && _utilityService.GetCurrentUserId().Equals(c.UserId));
            if (oldCategory == null) throw new BadRequestAlertException("Invalid Category Id or User Id", EntityName, "idnull");
            
            await CheckAllContacts(category);

            await _categoryRepository.CreateOrUpdateAsync(category);
            await _categoryRepository.SaveChangesAsync();
            return Ok(category)
                .WithHeaders(HeaderUtil.CreateEntityUpdateAlert(EntityName, category.Id.ToString()));
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Category>>> GetAllCategories(IPageable pageable, [FromQuery] bool eagerLoad = false)
        {
            _log.LogDebug("REST request to get a page of Categories");
            IPage<Category> result = null;
            
            if (eagerLoad)
            {
                result = await _categoryRepository.QueryHelper()
                    .Include(c => c.Contacts)
                    .Filter(c => c.UserId != null && _utilityService.GetCurrentUserId().Equals(c.UserId))                
                    .GetPageAsync(pageable);
            }
            else
            {
                result = await _categoryRepository.QueryHelper()
                    .Filter(c => c.UserId != null && _utilityService.GetCurrentUserId().Equals(c.UserId))                
                    .GetPageAsync(pageable);
            }
            
            return Ok(result.Content).WithHeaders(result.GeneratePaginationHttpHeaders());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCategory([FromRoute] long id)
        {
            _log.LogDebug($"REST request to get Category : {id}");
            var result = await _categoryRepository.QueryHelper()
                .Include(category => category.Contacts)
                .GetOneAsync(category => category.Id == id && _utilityService.GetCurrentUserId().Equals(category.UserId));
            return ActionResultUtil.WrapOrNotFound(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory([FromRoute] long id)
        {
            _log.LogDebug($"REST request to delete Category : {id}");

            Category category = await _categoryRepository.QueryHelper()
                .GetOneAsync(category => category.Id == id && _utilityService.GetCurrentUserId().Equals(category.UserId));
            if (category == null) throw new BadRequestAlertException("Invalid Id", EntityName, "idnull");

            await _categoryRepository.DeleteByIdAsync(id);
            await _categoryRepository.SaveChangesAsync();
            return NoContent().WithHeaders(HeaderUtil.CreateEntityDeletionAlert(EntityName, id.ToString()));
        }

        private async Task CheckAllContacts(Category category)
        {
            foreach(Contact contact in category.Contacts)
            {
                Contact fetchedContact = await _context.Contacts.FirstOrDefaultAsync(c => c.Id == contact.Id && _utilityService.GetCurrentUserId().Equals(c.UserId));
                if (fetchedContact is null) throw new BadRequestAlertException("Invalid Contact Id", EntityName, "idinvalid");
            }
        }
    }
}
