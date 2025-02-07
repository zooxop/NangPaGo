package com.mars.app.domain.userRecipe.repository;

import com.mars.common.model.userRecipe.UserRecipeLike;
import com.mars.common.model.userRecipe.UserRecipe;
import com.mars.common.model.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

import static jakarta.persistence.LockModeType.PESSIMISTIC_WRITE;

@Repository
public interface UserRecipeLikeRepository extends JpaRepository<UserRecipeLike, Long> {

    long countByUserRecipeId(Long userRecipeId);

    @Lock(PESSIMISTIC_WRITE)
    Optional<UserRecipeLike> findByUserAndUserRecipe(User user, UserRecipe userRecipe);

    @Query("SELECT url FROM UserRecipeLike url WHERE url.user.id = :userId AND url.userRecipe.id = :userRecipeId")
    Optional<UserRecipeLike> findByUserIdAndUserRecipeId(@Param("userId") Long userId, @Param("userRecipeId") Long userRecipeId);
}
