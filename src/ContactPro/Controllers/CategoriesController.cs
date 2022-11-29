
using System.Threading;
using System.Collections.Generic;
using System.Threading.Tasks;
using JHipsterNet.Core.Pagination;
using ContactPro.Domain.Entities;
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
    [Route("api/categories")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private const string EntityName = "category";
        private readonly ILogger<CategoriesController> _log;
        private readonly ICategoryRepository _categoryRepository;

        public CategoriesController(ILogger<CategoriesController> log,
        ICategoryRepository categoryRepository)
        {
            _log = log;
            _categoryRepository = categoryRepository;
        }

        [HttpPost]
        [ValidateModel]
        public async Task<ActionResult<Category>> CreateCategory([FromBody] Category category)
        {
            _log.LogDebug($"REST request to save Category : {category}");
            if (category.Id != 0)
                throw new BadRequestAlertException("A new category cannot already have an ID", EntityName, "idexists");

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
            await _categoryRepository.CreateOrUpdateAsync(category);
            await _categoryRepository.SaveChangesAsync();
            return Ok(category)
                .WithHeaders(HeaderUtil.CreateEntityUpdateAlert(EntityName, category.Id.ToString()));
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Category>>> GetAllCategories(IPageable pageable)
        {
            _log.LogDebug("REST request to get a page of Categories");
            var result = await _categoryRepository.QueryHelper()
                .Include(category => category.User)
                .Include(category => category.Contacts)
                .GetPageAsync(pageable);
            return Ok(result.Content).WithHeaders(result.GeneratePaginationHttpHeaders());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCategory([FromRoute] long id)
        {
            _log.LogDebug($"REST request to get Category : {id}");
            var result = await _categoryRepository.QueryHelper()
                .Include(category => category.User)
                .Include(category => category.Contacts)
                .GetOneAsync(category => category.Id == id);
            return ActionResultUtil.WrapOrNotFound(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory([FromRoute] long id)
        {
            _log.LogDebug($"REST request to delete Category : {id}");
            await _categoryRepository.DeleteByIdAsync(id);
            await _categoryRepository.SaveChangesAsync();
            return NoContent().WithHeaders(HeaderUtil.CreateEntityDeletionAlert(EntityName, id.ToString()));
        }
    }
}
