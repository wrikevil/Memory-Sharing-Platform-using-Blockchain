// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title MemorySharingPlatform
 * @dev A blockchain-based platform for sharing personal or collective memories
 */
contract MemorySharingPlatform {
    struct Memory {
        uint256 id;
        address creator;
        string title;
        string content;
        string mediaHash;  // IPFS hash for any attached media
        uint256 timestamp;
        bool isPrivate;
        mapping(address => bool) sharedWith;
        address[] sharedAddresses;
    }

    struct MemoryPreview {
        uint256 id;
        address creator;
        string title;
        uint256 timestamp;
        bool isPrivate;
    }

    uint256 private nextMemoryId;
    mapping(uint256 => Memory) private memories;
    mapping(address => uint256[]) private userMemories;

    event MemoryCreated(uint256 indexed id, address indexed creator, string title, uint256 timestamp);
    event MemoryShared(uint256 indexed id, address indexed sharedBy, address indexed sharedWith);
    event MemoryPrivacyUpdated(uint256 indexed id, bool isPrivate);

    /**
     * @dev Create a new memory
     * @param _title Title of the memory
     * @param _content Content of the memory
     * @param _mediaHash IPFS hash for any attached media
     * @param _isPrivate Privacy setting for the memory
     */
    function createMemory(
        string memory _title,
        string memory _content,
        string memory _mediaHash,
        bool _isPrivate
    ) external {
        uint256 memoryId = nextMemoryId;
        Memory storage newMemory = memories[memoryId];
        
        newMemory.id = memoryId;
        newMemory.creator = msg.sender;
        newMemory.title = _title;
        newMemory.content = _content;
        newMemory.mediaHash = _mediaHash;
        newMemory.timestamp = block.timestamp;
        newMemory.isPrivate = _isPrivate;
        
        userMemories[msg.sender].push(memoryId);
        nextMemoryId++;
        
        emit MemoryCreated(memoryId, msg.sender, _title, block.timestamp);
    }

    /**
     * @dev Get a memory that the caller has access to
     * @param _memoryId ID of the memory to retrieve
     * @return title Title of the memory
     * @return content Content of the memory
     * @return mediaHash IPFS hash of any attached media
     * @return timestamp When the memory was created
     * @return isPrivate Privacy setting of the memory
     * @return creator Address of the memory creator
     */
    function getMemory(uint256 _memoryId) external view 
        returns (
            string memory title,
            string memory content,
            string memory mediaHash,
            uint256 timestamp,
            bool isPrivate,
            address creator
        ) 
    {
        Memory storage memory_ = memories[_memoryId];
        
        require(
            memory_.creator == msg.sender || 
            !memory_.isPrivate || 
            memory_.sharedWith[msg.sender],
            "No access to this memory"
        );
        
        return (
            memory_.title,
            memory_.content,
            memory_.mediaHash,
            memory_.timestamp,
            memory_.isPrivate,
            memory_.creator
        );
    }

    /**
     * @dev Share a memory with another user
     * @param _memoryId ID of the memory to share
     * @param _recipient Address to share the memory with
     */
    function shareMemory(uint256 _memoryId, address _recipient) external {
        Memory storage memory_ = memories[_memoryId];
        
        require(memory_.creator == msg.sender, "Only the creator can share a memory");
        require(_recipient != address(0), "Invalid recipient address");
        require(!memory_.sharedWith[_recipient], "Memory already shared with this address");
        
        memory_.sharedWith[_recipient] = true;
        memory_.sharedAddresses.push(_recipient);
        
        emit MemoryShared(_memoryId, msg.sender, _recipient);
    }

    /**
     * @dev Update the privacy setting of a memory
     * @param _memoryId ID of the memory to update
     * @param _isPrivate New privacy setting
     */
    function updatePrivacy(uint256 _memoryId, bool _isPrivate) external {
        Memory storage memory_ = memories[_memoryId];
        
        require(memory_.creator == msg.sender, "Only the creator can update privacy");
        
        memory_.isPrivate = _isPrivate;
        
        emit MemoryPrivacyUpdated(_memoryId, _isPrivate);
    }

    /**
     * @dev Get all memories created by the caller
     * @return Array of memory IDs created by the caller
     */
    function getMyMemories() external view returns (uint256[] memory) {
        return userMemories[msg.sender];
    }

    /**
     * @dev Get public memories or those shared with the caller
     * @return Array of memory previews accessible to the caller
     */
    function getAccessibleMemoryPreviews() external view returns (MemoryPreview[] memory) {
        uint256 accessibleCount = 0;
        
        // Count accessible memories first
        for (uint256 i = 0; i < nextMemoryId; i++) {
            Memory storage memory_ = memories[i];
            if (!memory_.isPrivate || memory_.creator == msg.sender || memory_.sharedWith[msg.sender]) {
                accessibleCount++;
            }
        }
        
        // Create preview array
        MemoryPreview[] memory previews = new MemoryPreview[](accessibleCount);
        uint256 currentIndex = 0;
        
        // Populate preview array
        for (uint256 i = 0; i < nextMemoryId; i++) {
            Memory storage memory_ = memories[i];
            if (!memory_.isPrivate || memory_.creator == msg.sender || memory_.sharedWith[msg.sender]) {
                previews[currentIndex] = MemoryPreview({
                    id: memory_.id,
                    creator: memory_.creator,
                    title: memory_.title,
                    timestamp: memory_.timestamp,
                    isPrivate: memory_.isPrivate
                });
                currentIndex++;
            }
        }
        
        return previews;
    }
} 
