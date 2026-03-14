using DrustvenaMrezaApi.Models;
using DrustvenaMrezaApi.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DrustvenaMrezaApi.Controllers
{
    [Route("api/groups/{groupId}/users")]
    [ApiController]
    public class GroupMembersController : ControllerBase
    {

        // private UserRepository userRepository = new UserRepository();
        // private GroupMembersRepository membershipRepository = new GroupMembersRepository();
        // private GroupRepository groupRepository = new GroupRepository();
        private readonly GroupMembersDbRepository groupMembersDbRepository;
        private readonly GroupDbRepository groupDbRepository;
        private readonly UserDbRepository userDbRepository;

        public GroupMembersController(IConfiguration configuration)
        {
            groupMembersDbRepository = new GroupMembersDbRepository(configuration);
            groupDbRepository = new GroupDbRepository(configuration);
            userDbRepository = new UserDbRepository(configuration);
        }

        [HttpGet]
        public ActionResult<List<User>> GetUsersByGroup(int groupId)
        {
            if (groupDbRepository.GetById(groupId) == null)
            {
                return NotFound("Grupa ne postoji.");
            }

            try
            {
                List<User> users = groupMembersDbRepository.GetGroupMembers(groupId);
                return Ok(users);
            }
            catch (Exception ex)
            {
                return Problem("Doslo je do greske prilikom dohvatanja clanova: " + ex.Message);
            }
        }

        //Put api/groups/{groupId}/groups/{groupId}
        [HttpPut("{userId}")]
        public ActionResult<User> Add(int userId, int groupId)
        {
            {
                if (groupDbRepository.GetById(groupId) == null) return NotFound("Grupa ne postoji!");
                if (userDbRepository.GetById(userId) == null) return NotFound("Korisnik ne postoji!");

                try
                {
                    bool added = groupMembersDbRepository.AddGroupMember(groupId, userId);
                    if (!added)
                    {
                        return Conflict("Korisnik je vec clan ove grupe ili je doslo do konflikta.");
                    }
                    return Ok();
                }
                catch (Exception ex)
                {
                    return Problem("Doslo je do greske pri dodavanju korisnika u grupu: " + ex.Message);
                }

            }
        }

        [HttpDelete("{userId}")]
        public ActionResult Remove(int groupId, int userId)
        {
            if (groupDbRepository.GetById(groupId) == null) return NotFound("Grupa ne postoji.");
            if (userDbRepository.GetById(userId) == null) return NotFound("Korisnik ne postoji.");

            try
            {
                bool removed = groupMembersDbRepository.RemoveGroupMember(groupId, userId);
                if (!removed)
                {
                    return NotFound("Korisnik nije pronadjen u ovoj grupi.");
                }
                return NoContent();
            }
            catch (Exception ex)
            {
                return Problem("Doslo je do greske pri brisanju korisnika iz grupe: " + ex.Message);
            }
        }
    }
}
